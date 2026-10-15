// Adapted from https://framer.com/m/ParticleText-2NZQ.js@otOSwmqP2acS2BjTve4l
// Original particle sampling, mouse repulsion and damped return, with responsive
// font sizing, viewport suspension, touch support and a readable HTML fallback.
import { useEffect, useRef } from "react";

export default function ParticleText({ text = "NavQriti", motionEnabled }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!motionEnabled) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    let particles = [],
      width = 1,
      height = 1,
      visible = false,
      frame,
      disposed = false;
    const mouse = { x: -1000, y: -1000 };
    const sample = () => {
      if (disposed || !canvas.isConnected) return;
      const rect = canvas.getBoundingClientRect();
      // Resize callbacks can arrive while a route is hidden or being detached.
      // Keep the fallback until there is a drawable surface.
      if (rect.width < 1 || rect.height < 1) return;
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(devicePixelRatio, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const size = width / (text.length * 0.56);
      ctx.font = `600 ${size}px "Manrope Variable", Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#f7f7f5";
      ctx.fillText(text, width / 2, height / 2, width * 0.96);
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      particles = [];
      const gap = Math.max(3, Math.round(dpr * (width > 700 ? 4 : 3)));
      for (let y = 0; y < canvas.height; y += gap)
        for (let x = 0; x < canvas.width; x += gap) {
          if (pixels[(y * canvas.width + x) * 4 + 3] > 128)
            particles.push({
              x: x / dpr,
              y: y / dpr,
              baseX: x / dpr,
              baseY: y / dpr,
              vx: 0,
              vy: 0,
            });
        }
      canvas.parentElement.dataset.ready = "true";
    };
    const move = (e) => {
      const box = canvas.getBoundingClientRect();
      mouse.x = e.clientX - box.left;
      mouse.y = e.clientY - box.top;
    };
    const leave = () => {
      mouse.x = mouse.y = -1000;
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(canvas);
    const resize = new ResizeObserver(sample);
    resize.observe(canvas);
    document.fonts.ready.then(() => {
      if (!disposed) sample();
    });
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointerup", leave);
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (!visible || document.hidden) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#f7f7f5";
      for (const particle of particles) {
        const dx = mouse.x - particle.x,
          dy = mouse.y - particle.y,
          distance = Math.hypot(dx, dy);
        if (distance < 90) {
          const force = (90 - distance) / 90;
          const angle = Math.atan2(dy, dx);
          particle.vx -= Math.cos(angle) * force * 2;
          particle.vy -= Math.sin(angle) * force * 2;
        }
        particle.vx += (particle.baseX - particle.x) * 0.025;
        particle.vy += (particle.baseY - particle.y) * 0.025;
        particle.vx *= 0.91;
        particle.vy *= 0.91;
        particle.x += particle.vx;
        particle.y += particle.vy;
        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          width > 700 ? 1.4 : 0.9,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    };
    frame = requestAnimationFrame(animate);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointerup", leave);
      if (canvas.parentElement) delete canvas.parentElement.dataset.ready;
    };
  }, [text, motionEnabled]);
  return (
    <div
      className="footer-particle-word"
      data-component="ParticleText"
      role="img"
      aria-label={text}
    >
      <span>{text}</span>
      <canvas ref={ref} aria-hidden="true" />
    </div>
  );
}
