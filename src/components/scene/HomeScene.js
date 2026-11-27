"use client";

import { useEffect, useRef } from "react";
import { resetSceneState, sceneState } from "./sceneState";
import { buildSeeds, buildShapes, PRESENTATION } from "./shapes";

// The 3D sculpture behind the home page: a few thousand points that form one
// shape, then flow into the next as the visitor scrolls (see shapes.js).
// It is a fixed, full-screen canvas sitting behind the page content, so it
// shows wherever a section has no solid background: around the portrait in
// the hero, centre stage in the story chapter, and faintly elsewhere.
//
// Also here: the backdrop that darkens the whole page for the story chapter.
//
// The 3D library (three.js) is downloaded only when this runs, which is on
// the home page, after first paint, on a capable device, and not when the
// visitor has asked for reduced motion. Otherwise this renders nothing and
// the page looks as it did before.

const CAMERA_DISTANCE = 4.4;
const FIELD_OF_VIEW = 42;
// Colours as [r, g, b] from 0 to 1: far and near points on a light page,
// then on a dark one (the story chapter, or the dark theme).
const INK = [[0.04, 0.35, 0.36], [0.09, 0.63, 0.56]];
const GLOW = [[0.11, 0.62, 0.53], [0.55, 1.0, 0.88]];

const VERTEX = /* glsl */ `
  uniform float uMix;
  uniform float uTime;
  uniform float uJitter;
  uniform float uSize;
  attribute vec3 aTo;
  attribute float aSeed;
  varying float vNear;

  void main() {
    // Blend each point from its place in one shape to its place in the next.
    vec3 point = mix(position, aTo, uMix);
    // A small, endless wobble so the sculpture never sits completely still.
    float clock = uTime * (0.5 + aSeed * 0.9);
    point += uJitter * vec3(sin(clock + aSeed * 31.4), cos(clock * 1.3 + aSeed * 17.1), sin(clock * 0.7 + aSeed * 43.7));

    vec4 view = modelViewMatrix * vec4(point, 1.0);
    gl_Position = projectionMatrix * view;
    gl_PointSize = uSize * (0.7 + aSeed * 0.9) / -view.z;
    // 0 at the back of the sculpture, 1 at the front.
    vNear = clamp((view.z + ${(CAMERA_DISTANCE + 1.5).toFixed(1)}) / 3.0, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uFar;
  uniform vec3 uNearColour;
  uniform float uOpacity;
  varying float vNear;

  void main() {
    // Draw each point as a soft round dot.
    vec2 offset = gl_PointCoord - 0.5;
    float distance = dot(offset, offset);
    if (distance > 0.25) discard;
    float alpha = smoothstep(0.25, 0.02, distance) * uOpacity * (0.3 + 0.7 * vNear);
    gl_FragColor = vec4(mix(uFar, uNearColour, vNear), alpha);
  }
`;

const clamp01 = (value) => Math.max(0, Math.min(1, value));
const ease = (value) => value * value * (3 - 2 * value);

export default function HomeScene() {
  const hostRef = useRef(null);
  const backdropRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const backdrop = backdropRef.current;
    const root = document.documentElement;
    if (!host || !backdrop) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    // Leave weak devices on the plain page.
    if ((navigator.hardwareConcurrency ?? 4) < 4 || (navigator.deviceMemory ?? 8) < 4) return undefined;

    let cancelled = false;
    let stop = () => {};

    async function start() {
      const THREE = await import("three");
      if (cancelled) return;

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
      } catch {
        return; // No WebGL: stay on the plain page.
      }
      renderer.setClearColor(0x000000, 0);
      // The canvas is created and removed here, not rendered by React, so a
      // page that is hidden and shown again always gets a fresh one.
      host.appendChild(renderer.domElement);

      const small = window.innerWidth < 900;
      const count = small ? 3600 : 9000;
      const shapes = buildShapes(count);

      const geometry = new THREE.BufferGeometry();
      const from = new THREE.BufferAttribute(new Float32Array(shapes[0]), 3);
      const to = new THREE.BufferAttribute(new Float32Array(shapes[1]), 3);
      geometry.setAttribute("position", from);
      geometry.setAttribute("aTo", to);
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(buildSeeds(count), 1));

      const uniforms = {
        uMix: { value: 0 },
        uTime: { value: 0 },
        uJitter: { value: 0.03 },
        uSize: { value: 8 },
        uOpacity: { value: 0 },
        uFar: { value: new THREE.Vector3(...INK[0]) },
        uNearColour: { value: new THREE.Vector3(...INK[1]) },
      };
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        depthTest: false,
      });
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      const scene = new THREE.Scene();
      scene.add(points);
      const camera = new THREE.PerspectiveCamera(FIELD_OF_VIEW, 1, 0.1, 40);
      camera.position.z = CAMERA_DISTANCE;

      let halfWidth = 1;
      let pixelRatio = 1;
      function resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        // Half the width of what the camera sees at the sculpture's distance.
        halfWidth = Math.tan((FIELD_OF_VIEW * Math.PI) / 360) * CAMERA_DISTANCE * camera.aspect;
      }

      const aim = { x: 0, y: 0 };
      const look = { x: 0, y: 0 };
      function onPointerMove(event) {
        aim.x = (event.clientX / window.innerWidth) * 2 - 1;
        aim.y = (event.clientY / window.innerHeight) * 2 - 1;
      }

      let frame = 0;
      let last = performance.now();
      let pair = 0; // which two shapes are loaded: `pair` and `pair + 1`
      let turn = 0;
      let opacity = 0;
      let glow = 0;
      let backdropShown = -1;

      function render(now) {
        frame = requestAnimationFrame(render);
        if (document.hidden) return;
        const delta = Math.min(0.05, (now - last) / 1000);
        last = now;

        const scroll = window.scrollY;
        const viewport = window.innerHeight;
        const remaining = document.documentElement.scrollHeight - viewport - scroll;
        const darkTheme = root.dataset.theme === "dark";
        const chapter = sceneState.chapter;

        // The page darkens for the chapter and lightens again after it.
        if (Math.abs(chapter - backdropShown) > 0.002) {
          backdropShown = chapter;
          backdrop.style.opacity = chapter.toFixed(3);
        }

        // Strong in the hero and in the chapter, faint in between, and gone
        // by the closing call to action and the footer.
        const inHero = clamp01(1 - scroll / (viewport * 0.9));
        const wanted = Math.max(inHero * (darkTheme ? 0.9 : 0.78), chapter, 0.2) * clamp01((remaining / viewport) * 1.2 - 0.3);
        opacity += (wanted - opacity) * Math.min(1, delta * 6);
        renderer.domElement.style.visibility = opacity < 0.004 ? "hidden" : "visible";
        if (opacity < 0.004) return;

        const shape = Math.max(0, Math.min(shapes.length - 1.001, sceneState.shape));
        const index = Math.floor(shape);
        if (index !== pair) {
          from.array.set(shapes[index]);
          to.array.set(shapes[index + 1]);
          from.needsUpdate = true;
          to.needsUpdate = true;
          pair = index;
        }
        const blend = ease(shape - index);
        const here = PRESENTATION[index];
        const next = PRESENTATION[index + 1];
        const between = (key) => here[key] + (next[key] - here[key]) * blend;

        // The wide, flat wave at the end should not swing round.
        const settling = clamp01(shape - (shapes.length - 2));
        turn += delta * 0.14 * (1 - settling);
        look.x += (aim.x - look.x) * 0.05;
        look.y += (aim.y - look.y) * 0.05;
        points.rotation.y = turn * (1 - settling) + look.x * 0.35;
        points.rotation.x = 0.1 + look.y * 0.18;
        points.scale.setScalar(between("scale") * (small ? 0.8 : 1));
        points.position.x = between("across") * halfWidth * (small ? 0.35 : 1);

        // Ink on a light page, a glow on a dark one.
        glow += ((darkTheme ? 1 : chapter) - glow) * Math.min(1, delta * 5);
        uniforms.uFar.value.set(...INK[0].map((value, channel) => value + (GLOW[0][channel] - value) * glow));
        uniforms.uNearColour.value.set(...INK[1].map((value, channel) => value + (GLOW[1][channel] - value) * glow));

        uniforms.uMix.value = blend;
        uniforms.uTime.value += delta;
        uniforms.uJitter.value = between("jitter");
        uniforms.uSize.value = between("size") * 8.5 * pixelRatio;
        uniforms.uOpacity.value = opacity;
        renderer.render(scene, camera);
      }

      resize();
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      root.dataset.scene = "on";
      frame = requestAnimationFrame(render);

      stop = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointerMove);
        delete root.dataset.scene;
        backdrop.style.opacity = "0";
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };
    }

    // Wait until the browser is idle, so the 3D never delays the first paint.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 400);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      stop();
      resetSceneState();
    };
  }, []);

  return (
    <div className="scene" aria-hidden="true">
      <div className="scene-backdrop" ref={backdropRef} />
      <div className="scene-canvas" ref={hostRef} />
    </div>
  );
}
