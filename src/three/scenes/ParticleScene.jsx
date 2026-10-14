import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createDotGrid } from "../objects/Grid";
import vertexShader from "../shaders/vertex.glsl?raw";
import fragmentShader from "../shaders/fragment.glsl?raw";

export default function ParticleScene({ heroRef, motionEnabled }) {
  const hostRef = useRef(null);
  const enabledRef = useRef(motionEnabled);
  const redrawRef = useRef(true);
  useEffect(() => {
    enabledRef.current = motionEnabled;
    redrawRef.current = true;
  }, [motionEnabled]);

  useEffect(() => {
    const host = hostRef.current;
    const hero = heroRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    host.dataset.ready = "true";

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 0, 1, 0.1, 10);
    camera.position.z = 2;
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: pixelRatio },
        uPointer: { value: new THREE.Vector2(-1000, -1000) },
        uHover: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const pointer = {
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
      active: false,
    };
    let clientPoint = null;
    const ripple = { x: 0, y: 0, age: 2 };
    let grid;
    let frame;
    let visible = true;
    let pageVisible = !document.hidden;
    let lost = false;
    let dirty = true;
    let lastTime = 0;
    let elapsed = 0;
    let width = 0;
    let height = 0;
    const resize = () => {
      const box = host.getBoundingClientRect();
      if (box.width === width && box.height === height) return;
      width = box.width;
      height = box.height;
      renderer.setSize(width, height);
      camera.right = width;
      camera.bottom = height;
      camera.updateProjectionMatrix();
      if (grid) {
        scene.remove(grid.points);
        grid.dispose();
      }
      grid = createDotGrid(width, height, material);
      scene.add(grid.points);
      dirty = true;
    };
    const move = (event) => {
      if (!enabledRef.current) return;
      clientPoint = { x: event.clientX, y: event.clientY };
      const box = host.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      pointer.vx = pointer.active
        ? THREE.MathUtils.clamp(x - pointer.x, -40, 40)
        : 0;
      pointer.vy = pointer.active
        ? THREE.MathUtils.clamp(y - pointer.y, -40, 40)
        : 0;
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
    };
    const leave = () => {
      pointer.active = false;
      clientPoint = null;
    };
    const scroll = () => {
      if (!clientPoint || !enabledRef.current) return;
      const box = host.getBoundingClientRect();
      pointer.x = clientPoint.x - box.left;
      pointer.y = clientPoint.y - box.top;
      pointer.active =
        pointer.y >= 0 &&
        pointer.y <= box.height &&
        pointer.x >= 0 &&
        pointer.x <= box.width;
    };
    const release = (event) => {
      if (event.pointerType === "touch") leave();
    };
    const press = (event) => {
      if (
        !enabledRef.current ||
        event.target.closest("button, a, input, select, textarea")
      )
        return;
      move(event);
      ripple.x = pointer.x;
      ripple.y = pointer.y;
      ripple.age = 0;
    };
    const contextLost = (event) => {
      event.preventDefault();
      lost = true;
      host.dataset.ready = "false";
    };
    const contextRestored = () => {
      lost = false;
      dirty = true;
      host.dataset.ready = "true";
    };
    const visibilityChanged = () => {
      pageVisible = !document.hidden;
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(hero);
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", leave);
    hero.addEventListener("pointercancel", leave);
    hero.addEventListener("pointerdown", press, { passive: true });
    hero.addEventListener("pointerup", release);
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("visibilitychange", visibilityChanged);
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      contextRestored,
    );
    resize();

    function render(time) {
      frame = requestAnimationFrame(render);
      const delta = Math.min((time - lastTime) / 1000 || 0, 0.033);
      lastTime = time;
      if (!visible || !pageVisible || lost || !grid) return;
      if (!enabledRef.current && !dirty && !redrawRef.current) return;
      if (enabledRef.current) {
        elapsed += delta;
        ripple.age += delta;
        grid.update(delta, elapsed, pointer, ripple);
        material.uniforms.uPointer.value.set(pointer.x, pointer.y);
        material.uniforms.uHover.value = THREE.MathUtils.lerp(
          material.uniforms.uHover.value,
          pointer.active ? 1 : 0,
          1 - Math.exp(-delta * 4),
        );
        pointer.vx *= 0.88;
        pointer.vy *= 0.88;
      } else {
        material.uniforms.uHover.value = 0;
        pointer.active = false;
      }
      renderer.render(scene, camera);
      dirty = false;
      redrawRef.current = false;
    }
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", leave);
      hero.removeEventListener("pointercancel", leave);
      hero.removeEventListener("pointerdown", press);
      hero.removeEventListener("pointerup", release);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", visibilityChanged);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        contextRestored,
      );
      grid?.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      delete host.dataset.ready;
    };
  }, [heroRef]);

  return <div className="hero-particles" ref={hostRef} aria-hidden="true" />;
}
