import { useEffect, useRef } from "react";
import * as THREE from "three";
import { warpFragmentShader } from "../../three/shaders/quantumLiquid";

// Local React/Three adapter of the supplied AnimatedLiquidBackground, Vortex preset.
export default function QuantumLiquidHero({ motionEnabled }) {
  const ref = useRef(null);
  const playback = useRef(motionEnabled);
  useEffect(() => { playback.current = motionEnabled; }, [motionEnabled]);
  useEffect(() => {
    const host = ref.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "low-power" }); } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
      u_time: { value: -62 }, u_pixelRatio: { value: renderer.getPixelRatio() }, u_resolution: { value: new THREE.Vector2() },
      u_scale: { value: .4 }, u_rotation: { value: 50 * Math.PI / 180 },
      u_color1: { value: new THREE.Vector4(0, 0, 0, 1) }, u_color2: { value: new THREE.Vector4(.88, .9, .92, 1) }, u_color3: { value: new THREE.Vector4(0, 0, 0, 1) },
      u_proportion: { value: .41 }, u_softness: { value: .05 }, u_distortion: { value: 0 },
      u_swirl: { value: 1 }, u_swirlIterations: { value: 3 }, u_shapeScale: { value: .8 }, u_shape: { value: 1 },
    };
    const material = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3, uniforms, fragmentShader: warpFragmentShader,
      vertexShader: "precision highp float; in vec3 position; void main(){gl_Position=vec4(position,1.0);}",
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));
    host.appendChild(renderer.domElement);
    const resize = () => {
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.getDrawingBufferSize(uniforms.u_resolution.value);
      renderer.render(scene, camera);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    let visible = true, frame, last = 0;
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    intersection.observe(host);
    const animate = (now) => {
      frame = requestAnimationFrame(animate);
      const dt = Math.min((now - last) / 1000, .04); last = now;
      if (!visible || document.hidden || !playback.current) return;
      uniforms.u_time.value += dt * .21;
      renderer.render(scene, camera);
    };
    resize();
    host.dataset.ready = "true";
    frame = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); delete host.dataset.ready; };
  }, []);
  return <div className="quantum-liquid" ref={ref} aria-hidden="true" data-component="AnimatedLiquidBackground" />;
}
