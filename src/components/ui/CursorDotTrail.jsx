// Adapted from the user-supplied CursorDotTrail component:
// https://framer.com/m/CursorDotTrail-ZDqFAE.js@iLyzK205nNCuHNDP5Nsc
// Preserves its spring/friction, 200ms wake, dot-to-ring interaction and optional
// link underline. Difference blending keeps the monochrome trail visible on both themes.
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import useMediaQuery from "../../hooks/useMediaQuery";
import "../../cursor-trail.css";

const SIZE = 12;
const HOVER_SIZE = 40;
const DURATION = 200;
const hideSelector = '[data-cursor-trail="hide"],[aria-label~="trail{hide}"],[data-framer-name~="trail{hide}"]';
const linkSelector = '[data-cursor-trail="link"],[aria-label~="trail{link}"],[data-framer-name~="trail{link}"]';

export default function CursorDotTrail({ motionEnabled, portal = true }) {
  const ref = useRef(null);
  const finePointer = useMediaQuery("(any-hover: hover) and (any-pointer: fine)");
  const enabled = motionEnabled && finePointer;
  useEffect(() => {
    if (!enabled) return;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = 0, height = 0, frame = 0, lastTime = 0, active = false;
    let points = [], radius = SIZE / 2, fill = 1, stroke = 0, underline = 0;
    const ball = { x: 0, y: 0 }, target = { x: 0, y: 0 }, velocity = { x: 0, y: 0 };
    const clear = () => ctx.clearRect(0, 0, width, height);
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0; active = false; points = [];
      velocity.x = velocity.y = 0; radius = SIZE / 2; fill = 1; stroke = underline = 0;
      clear();
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      reset();
    };
    const draw = (now) => {
      frame = 0;
      if (!active || document.hidden) return;
      const dt = Math.min(now - lastTime || 16.67, 33.34);
      lastTime = now;
      const step = dt / 16.67;
      const spring = .15 * step;
      const friction = Math.pow(.5, step);
      velocity.x = (velocity.x + (target.x - ball.x) * spring) * friction;
      velocity.y = (velocity.y + (target.y - ball.y) * spring) * friction;
      ball.x += velocity.x * step; ball.y += velocity.y * step;
      const last = points[points.length - 1];
      if (!last || Math.hypot(ball.x - last.x, ball.y - last.y) > .2) points.push({ x: ball.x, y: ball.y, time: now });
      points = points.filter(p => now - p.time < DURATION);
      const el = document.elementFromPoint(target.x, target.y);
      clear();
      if (el?.closest(hideSelector)) { points = []; return; }
      const link = el?.closest(linkSelector);
      const ring = !!el?.closest('a,button,[role="button"],[role="tab"],summary');
      const workCard = !!el?.closest('[aria-label~="work-card"]');
      const targetRadius = ring && !workCard ? HOVER_SIZE / 2 : SIZE / 2;
      const targetFill = ring || link ? 0 : 1;
      const targetStroke = ring && !link ? 1 : 0;
      const amount = 1 - Math.pow(.85, step);
      radius += (targetRadius - radius) * amount;
      fill += ((workCard ? 1 : targetFill) - fill) * amount;
      stroke += ((workCard ? 0 : targetStroke) - stroke) * amount;
      underline += ((link ? 1 : 0) - underline) * amount;

      if (points.length > 1) {
        const first = points[0], newest = points[points.length - 1];
        const gradient = ctx.createLinearGradient(first.x, first.y, newest.x + .001, newest.y + .001);
        gradient.addColorStop(0, `rgba(255,255,255,${Math.max(0, 1 - (now - first.time) / DURATION) * .3})`);
        gradient.addColorStop(1, "rgba(255,255,255,1)");
        ctx.beginPath();ctx.moveTo(first.x, first.y);
        points.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = gradient; ctx.lineWidth = SIZE / 4; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke();
      }
      if (link) {
        const rect = link.getBoundingClientRect();
        const length = rect.width * underline;
        ctx.beginPath();ctx.moveTo(rect.left + (rect.width - length) / 2, rect.bottom + 1);
        ctx.lineTo(rect.left + (rect.width + length) / 2, rect.bottom + 1);
        ctx.strokeStyle = `rgba(255,255,255,${underline})`;ctx.lineWidth = 1;ctx.stroke();
      } else {
        ctx.beginPath();ctx.arc(ball.x, ball.y, radius, 0, Math.PI * 2);
        if (fill > .01) { ctx.fillStyle = `rgba(255,255,255,${fill})`;ctx.fill(); }
        if (stroke > .01) { ctx.strokeStyle = `rgba(255,255,255,${stroke})`;ctx.lineWidth = 2;ctx.stroke(); }
      }
      // Sleep once the wake and hover transition settle; pointer/scroll events restart it.
      const settling = Math.hypot(target.x - ball.x, target.y - ball.y) > .1 || Math.abs(radius - targetRadius) > .05 || Math.abs(underline - (link ? 1 : 0)) > .005;
      if (points.length > 1 || settling) frame = requestAnimationFrame(draw);
    };
    const wake = () => { if (active && !frame && !document.hidden) { lastTime = performance.now(); frame = requestAnimationFrame(draw); } };
    const move = (event) => {
      if (event.pointerType !== "mouse" && event.pointerType !== "pen") { reset(); return; }
      target.x = event.clientX; target.y = event.clientY;
      if (!active) { ball.x = target.x; ball.y = target.y; active = true; }
      wake();
    };
    const leave = (event) => { if (!event.relatedTarget) reset(); };
    const visibility = () => { if (document.hidden) reset(); };
    resize();
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerout", leave, { passive: true });
    window.addEventListener("pointercancel", reset, { passive: true });
    window.addEventListener("scroll", wake, { passive: true, capture: true });
    window.addEventListener("resize", resize);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      reset();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("pointercancel", reset);
      window.removeEventListener("scroll", wake, true);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [enabled]);
  if (!enabled) return null;
  const canvas = <canvas ref={ref} className="cursor-dot-trail" data-component="CursorDotTrail" aria-hidden="true" />;
  return portal ? createPortal(canvas, document.body) : canvas;
}
