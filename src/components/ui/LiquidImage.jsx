// Adapted from https://framer.com/m/LiquidImage-DMcO.js@leTg7a7qKyDtXCpjPzIv
// Its ripple/wake and grayscale-reveal shader runs through the project's Three.js
// renderer, with image fallbacks, lazy GPU setup and explicit resource disposal.
import { useEffect, useRef } from "react";
import * as THREE from "three";
import useSceneReady from "../../hooks/useSceneReady";
import { liquidFragment } from "../../three/shaders/liquid";

export default function LiquidImage({
  src,
  alt,
  motionEnabled,
  contain = false,
  reveal = true,
}) {
  const ref = useRef(null);
  const ready = useSceneReady(ref, 300);
  useEffect(() => {
    if (!ready || !motionEnabled) return;
    const host = ref.current;
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
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene(),
      camera = new THREE.Camera();
    const offscreen = document.createElement("canvas");
    const pen = offscreen.getContext("2d");
    const texture = new THREE.CanvasTexture(offscreen);
    texture.minFilter = THREE.LinearFilter;
    const uniforms = {
      u_image: { value: texture },
      u_mouse: { value: new THREE.Vector2(-10, -10) },
      u_time: { value: 0 },
      u_strength: { value: 0.3 },
      u_speed: { value: 0.3 },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_wakeCount: { value: 0 },
      u_wake: { value: Array.from({ length: 16 }, () => new THREE.Vector3()) },
      u_maskRadius: { value: 0 },
      u_colorReveal: { value: reveal ? 1 : 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      vertexShader:
        "varying vec2 v_uv; void main(){v_uv=uv;gl_Position=vec4(position,1.0);}",
      fragmentShader: liquidFragment,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));
    let frame,
      loaded = false,
      visible = false,
      disposed = false,
      hovered = false,
      width = 1,
      height = 1;
    const image = new Image(),
      wake = [],
      start = performance.now();
    const resize = () => {
      width = host.clientWidth;
      height = host.clientHeight;
      renderer.setSize(width, height);
      uniforms.u_resolution.value.set(width, height);
      if (!loaded) return;
      // Reallocate the GPU texture when the responsive backing canvas changes size.
      texture.dispose();
      offscreen.width = Math.round(width * renderer.getPixelRatio());
      offscreen.height = Math.round(height * renderer.getPixelRatio());
      const scale = (contain ? Math.min : Math.max)(
        offscreen.width / image.width,
        offscreen.height / image.height,
      );
      const w = image.width * scale,
        h = image.height * scale;
      pen.clearRect(0, 0, offscreen.width, offscreen.height);
      pen.drawImage(
        image,
        (offscreen.width - w) / 2,
        (offscreen.height - h) / 2,
        w,
        h,
      );
      texture.needsUpdate = true;
    };
    image.onload = () => {
      if (!disposed) {
        loaded = true;
        resize();
      }
    };
    image.src = src;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(host);
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(host);
    const move = (event) => {
      const box = host.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width,
        y = 1 - (event.clientY - box.top) / box.height;
      uniforms.u_mouse.value.set(x, y);
      hovered = true;
      wake.push(new THREE.Vector3(x, y, (performance.now() - start) / 1000));
      if (wake.length > 16) wake.shift();
    };
    const leave = () => {
      hovered = false;
      uniforms.u_mouse.value.set(-10, -10);
    };
    const lost = (event) => {
      event.preventDefault();
      loaded = false;
      delete host.dataset.ready;
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerup", leave);
    host.addEventListener("pointercancel", leave);
    renderer.domElement.addEventListener("webglcontextlost", lost);
    const render = (now) => {
      frame = requestAnimationFrame(render);
      if (!visible || !loaded || document.hidden) return;
      uniforms.u_time.value = (now - start) / 1000;
      uniforms.u_maskRadius.value +=
        ((hovered ? 1.5 : 0) - uniforms.u_maskRadius.value) * 0.06;
      uniforms.u_wakeCount.value = wake.length;
      wake.forEach((value, i) => uniforms.u_wake.value[i].copy(value));
      renderer.render(scene, camera);
      host.dataset.ready = "true";
    };
    frame = requestAnimationFrame(render);
    return () => {
      disposed = true;
      image.onload = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerup", leave);
      host.removeEventListener("pointercancel", leave);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      delete host.dataset.ready;
    };
  }, [ready, motionEnabled, src, contain, reveal]);
  return (
    <div
      ref={ref}
      className={`nq-liquid ${contain ? "nq-liquid-contain" : ""}`}
      data-component="LiquidImage"
    >
      <img src={src} alt={alt} loading={contain ? "eager" : "lazy"} />
    </div>
  );
}
