"use client";

import { useEffect, useRef } from "react";

// The 3D figure beside the doctor's quote: a slowly turning network of nodes (the brain)
// with a twisting bundle of fibres below it (the spinal cord). Signals travel
// up the fibres and spread across the network, which is the story of CRPS:
// a pain signal that keeps firing. Drawn on a 2D canvas with its own small
// perspective projection, so there is no 3D library to download.

const NODE_COUNT = 150;
const LINKS_PER_NODE = 3;
const FIBRES = 6;
const FIBRE_POINTS = 30;
const BRAIN_Y = 0.5;
const CAMERA = 3.7;
// Line, node and signal colours (as "r, g, b") for each background.
const TONES = {
  light: { line: "14, 124, 123", node: "10, 90, 91", signal: "44, 207, 164" },
  dark: { line: "150, 232, 210", node: "236, 255, 250", signal: "92, 255, 200" },
};

function buildModel() {
  // Evenly spread points on a sphere (Fibonacci lattice), slightly roughened.
  const nodes = [];
  for (let i = 0; i < NODE_COUNT; i += 1) {
    const polar = Math.acos(1 - (2 * (i + 0.5)) / NODE_COUNT);
    const around = Math.PI * (1 + Math.sqrt(5)) * i;
    const radius = 0.94 + ((i * 37) % 11) / 100;
    nodes.push({
      x: radius * Math.sin(polar) * Math.cos(around),
      y: BRAIN_Y + radius * Math.cos(polar),
      z: radius * Math.sin(polar) * Math.sin(around),
      links: [],
    });
  }

  // Join each node to its nearest neighbours.
  const links = [];
  const seen = new Set();
  nodes.forEach((node, index) => {
    const nearest = nodes
      .map((other, otherIndex) => ({
        otherIndex,
        distance: (node.x - other.x) ** 2 + (node.y - other.y) ** 2 + (node.z - other.z) ** 2,
      }))
      .filter((entry) => entry.otherIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, LINKS_PER_NODE);
    nearest.forEach(({ otherIndex }) => {
      const key = index < otherIndex ? `${index}-${otherIndex}` : `${otherIndex}-${index}`;
      if (seen.has(key)) return;
      seen.add(key);
      links.push([index, otherIndex]);
      node.links.push(otherIndex);
      nodes[otherIndex].links.push(index);
    });
  });

  // The fibres leave the bottom of the sphere, twist, and fan out at the end.
  const fibres = [];
  for (let strand = 0; strand < FIBRES; strand += 1) {
    const points = [];
    for (let step = 0; step < FIBRE_POINTS; step += 1) {
      const along = step / (FIBRE_POINTS - 1);
      const angle = (strand / FIBRES) * Math.PI * 2 + along * 3.4;
      const spread = 0.07 + 0.34 * along ** 2.4;
      points.push({
        x: spread * Math.cos(angle),
        y: BRAIN_Y - 0.98 - along * 1.3,
        z: spread * Math.sin(angle),
      });
    }
    fibres.push(points);
  }

  // Signals enter the network through the nodes nearest the bottom.
  const entry = nodes
    .map((node, index) => ({ index, y: node.y }))
    .sort((a, b) => a.y - b.y)
    .slice(0, 6)
    .map((item) => item.index);

  return { nodes, links, fibres, entry };
}

// tone: "light" for a pale background, "dark" for a dark card.
export default function NerveField({ tone = "light" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const model = buildModel();
    const colours = TONES[tone] ?? TONES.light;

    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let visible = true;
    let spin = 0.6;
    let last = performance.now();
    // Pointer position relative to the canvas centre, eased toward `aim`.
    const aim = { x: 0, y: 0 };
    const look = { x: 0, y: 0 };

    // Signals on the fibres: `along` runs from 1 (the far end) up to 0.
    const fibreSignals = model.fibres.map((_, index) => ({
      fibre: index,
      along: 0.3 + ((index * 0.37) % 0.7),
      speed: 0.16 + (index % 3) * 0.05,
    }));
    // Signals inside the network: travelling from node `from` to node `to`.
    let hops = [];

    function startHop(from, avoid) {
      const options = model.nodes[from].links.filter((index) => index !== avoid);
      if (!options.length) return;
      const to = options[Math.floor(Math.random() * options.length)];
      hops.push({ from, to, progress: 0, speed: 1.1 + Math.random() * 0.9, life: 5 + Math.floor(Math.random() * 6) });
    }
    for (let i = 0; i < 12; i += 1) startHop(Math.floor(Math.random() * NODE_COUNT), -1);

    function resize() {
      ratio = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      if (reduce) draw(0);
    }

    function project(point, sinY, cosY, sinX, cosX, scale) {
      const x = point.x * cosY + point.z * sinY;
      const z = -point.x * sinY + point.z * cosY;
      const y = (point.y - 0.02) * cosX - z * sinX;
      const depth = (point.y - 0.02) * sinX + z * cosX;
      const zoom = CAMERA / (CAMERA - depth);
      return {
        x: width / 2 + x * zoom * scale,
        y: height * 0.47 - y * zoom * scale,
        zoom,
        // 0 at the back of the figure, 1 at the front.
        near: Math.max(0, Math.min(1, (depth + 1.1) / 2.2)),
      };
    }

    function draw(delta) {
      look.x += (aim.x - look.x) * 0.05;
      look.y += (aim.y - look.y) * 0.05;
      spin += delta * 0.16;

      const angleY = spin + look.x * 0.7;
      const angleX = 0.16 + look.y * 0.32;
      const sinY = Math.sin(angleY);
      const cosY = Math.cos(angleY);
      const sinX = Math.sin(angleX);
      const cosX = Math.cos(angleX);
      const scale = Math.min(width / 2.9, height / 3.75);
      const at = (point) => project(point, sinY, cosY, sinX, cosX, scale);

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";

      const placed = model.nodes.map(at);

      model.links.forEach(([a, b]) => {
        const near = (placed[a].near + placed[b].near) / 2;
        context.strokeStyle = `rgba(${colours.line}, ${(0.05 + near * 0.3).toFixed(3)})`;
        context.lineWidth = 0.6 + near * 0.7;
        context.beginPath();
        context.moveTo(placed[a].x, placed[a].y);
        context.lineTo(placed[b].x, placed[b].y);
        context.stroke();
      });

      const fibrePaths = model.fibres.map((points) => points.map(at));
      fibrePaths.forEach((path) => {
        for (let i = 1; i < path.length; i += 1) {
          const near = (path[i].near + path[i - 1].near) / 2;
          const fade = 1 - (i / path.length) * 0.55;
          context.strokeStyle = `rgba(${colours.line}, ${((0.1 + near * 0.4) * fade).toFixed(3)})`;
          context.lineWidth = 0.8 + near * 1;
          context.beginPath();
          context.moveTo(path[i - 1].x, path[i - 1].y);
          context.lineTo(path[i].x, path[i].y);
          context.stroke();
        }
      });

      placed.forEach((point) => {
        context.fillStyle = `rgba(${colours.node}, ${(0.2 + point.near * 0.65).toFixed(3)})`;
        context.beginPath();
        context.arc(point.x, point.y, (1 + point.near * 1.9) * point.zoom, 0, Math.PI * 2);
        context.fill();
      });

      function signal(x, y, size, strength) {
        context.fillStyle = `rgba(${colours.signal}, ${(0.2 * strength).toFixed(3)})`;
        context.beginPath();
        context.arc(x, y, size * 3.2, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = `rgba(${colours.signal}, ${(0.95 * strength).toFixed(3)})`;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
      }

      fibreSignals.forEach((item) => {
        item.along -= delta * item.speed;
        if (item.along <= 0) {
          // Arrived at the brain: pass the signal into the network.
          item.along = 1;
          if (hops.length < 34) startHop(model.entry[item.fibre % model.entry.length], -1);
        }
        const path = fibrePaths[item.fibre];
        const position = item.along * (path.length - 1);
        const index = Math.min(path.length - 2, Math.floor(position));
        const mix = position - index;
        const a = path[index];
        const b = path[index + 1];
        signal(a.x + (b.x - a.x) * mix, a.y + (b.y - a.y) * mix, 2.2 + a.near * 1.6, 0.5 + a.near * 0.5);
      });

      const next = [];
      hops.forEach((hop) => {
        hop.progress += delta * hop.speed;
        const a = placed[hop.from];
        const b = placed[hop.to];
        if (hop.progress >= 1) {
          if (hop.life > 0) {
            const before = hops.length + next.length;
            if (before < 60) {
              const options = model.nodes[hop.to].links.filter((index) => index !== hop.from);
              if (options.length) {
                next.push({
                  from: hop.to,
                  to: options[Math.floor(Math.random() * options.length)],
                  progress: 0,
                  speed: hop.speed,
                  life: hop.life - 1,
                });
              }
            }
          }
          return;
        }
        const near = a.near + (b.near - a.near) * hop.progress;
        signal(a.x + (b.x - a.x) * hop.progress, a.y + (b.y - a.y) * hop.progress, 1.8 + near * 1.6, 0.35 + near * 0.65);
        next.push(hop);
      });
      hops = next;
      if (hops.length < 10) startHop(Math.floor(Math.random() * NODE_COUNT), -1);
    }

    function loop(now) {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible && !document.hidden) draw(delta);
      frame = requestAnimationFrame(loop);
    }

    function onPointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      aim.x = Math.max(-1, Math.min(1, (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2)));
      aim.y = Math.max(-1, Math.min(1, (event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2)));
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(canvas);
    resize();

    if (!reduce) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [tone]);

  return <canvas ref={canvasRef} aria-hidden="true" />;
}
