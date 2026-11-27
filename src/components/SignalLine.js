"use client";

import { useEffect, useRef } from "react";

// A live signal: on the left it is a jagged, spiking pain signal; by the right
// it has settled into a calm line. Wherever the visitor moves the pointer, the
// signal quietens around it. Drawn on a canvas; purely decorative. Shown in a
// small card in the expertise page's "The signal, traced" section, on a dark
// background.

const PAIN = "240, 112, 90"; // warm coral, used only here
const TEAL = "14, 124, 123";
const MINT = "44, 207, 164";
const CALM_RADIUS = 170; // how far the pointer's calming effect reaches, in px

export default function SignalLine() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let visible = false;
    let time = 0;
    let last = performance.now();
    let pointerX = -9999;
    let calming = 0; // eased 0 to 1 while the pointer is over the signal
    let calmingTarget = 0;

    // Height of the signal at horizontal position x. `phase` offsets the
    // fainter echo lines so they do not sit exactly on the main one.
    function signalAt(x, phase) {
      const along = x / width;
      const envelope = Math.pow(1 - along, 1.5); // loud on the left, silent on the right
      const nearPointer = Math.exp(-((x - pointerX) ** 2) / (2 * CALM_RADIUS * CALM_RADIUS));
      const amplitude = height * 0.36 * envelope * (1 - calming * nearPointer);

      const carrier =
        Math.sin(x * 0.05 - time * 3.2 + phase) * 0.5 + Math.sin(x * 0.115 + time * 4.6 + phase * 2) * 0.26;
      // Sharp upward spikes with a smaller dip just after, like a nerve impulse.
      const spike = Math.pow(Math.max(0, Math.sin(x * 0.018 - time * 2.1 + phase)), 14) * 1.2;
      const dip = Math.pow(Math.max(0, Math.sin(x * 0.018 - time * 2.1 + phase - 0.55)), 14) * 0.55;
      // A slow swell that keeps the calm end gently alive.
      const breath = Math.sin(x * 0.012 - time * 1.1 + phase) * 5 * (0.35 + along * 0.65);

      return height * 0.5 - amplitude * (carrier + spike - dip) + breath;
    }

    function trace(phase) {
      context.beginPath();
      for (let x = 0; x <= width; x += 3) {
        const y = signalAt(x, phase);
        if (x === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
    }

    function draw() {
      if (!width || !height) return;
      calming += (calmingTarget - calming) * 0.08;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.lineJoin = "round";
      context.lineCap = "round";

      // Resting line the signal settles onto.
      context.strokeStyle = "rgba(255, 255, 255, 0.12)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, height * 0.5);
      context.lineTo(width, height * 0.5);
      context.stroke();

      const colour = (alpha) => {
        const gradient = context.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, `rgba(${PAIN}, ${alpha})`);
        gradient.addColorStop(0.38, `rgba(${TEAL}, ${alpha})`);
        gradient.addColorStop(1, `rgba(${MINT}, ${alpha})`);
        return gradient;
      };

      // Two faint echoes behind the main line.
      context.lineWidth = 1.3;
      context.strokeStyle = colour(0.2);
      trace(1.9);
      context.stroke();
      context.strokeStyle = colour(0.36);
      trace(0.95);
      context.stroke();

      context.lineWidth = 2.6;
      context.strokeStyle = colour(1);
      context.shadowColor = `rgba(${MINT}, 0.55)`;
      context.shadowBlur = 14;
      trace(0);
      context.stroke();
      context.shadowBlur = 0;

      // Two impulses travelling along the main line, from pain toward calm.
      for (const offset of [0, 0.5]) {
        const x = ((time * 0.11 + offset) % 1) * (width + 160) - 80;
        if (x < 0 || x > width) continue;
        const y = signalAt(x, 0);
        context.fillStyle = `rgba(${MINT}, 0.22)`;
        context.beginPath();
        context.arc(x, y, 13, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = "#ffffff";
        context.strokeStyle = `rgba(${MINT}, 0.9)`;
        context.lineWidth = 2;
        context.beginPath();
        context.arc(x, y, 5, 0, Math.PI * 2);
        context.fill();
        context.stroke();
      }
    }

    function loop(now) {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible && !document.hidden) {
        time += delta;
        draw();
      }
      frame = requestAnimationFrame(loop);
    }

    function resize() {
      ratio = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      draw();
    }

    function onPointerMove(event) {
      pointerX = event.clientX - canvas.getBoundingClientRect().left;
      calmingTarget = 1;
    }
    function onPointerLeave() {
      calmingTarget = 0;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(canvas);
    resize();

    if (!reduce) {
      wrap.addEventListener("pointermove", onPointerMove, { passive: true });
      wrap.addEventListener("pointerleave", onPointerLeave);
      frame = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      wrap.removeEventListener("pointermove", onPointerMove);
      wrap.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div className="signal-card" ref={wrapRef} aria-hidden="true">
      <div className="signal-card-head">
        <span className="signal-live">Live signal</span>
        <span className="signal-hint">Hover to quiet it</span>
      </div>
      <canvas ref={canvasRef} />
      <div className="signal-card-foot">
        <span className="from">Pain</span>
        <span className="to">Relief</span>
      </div>
    </div>
  );
}
