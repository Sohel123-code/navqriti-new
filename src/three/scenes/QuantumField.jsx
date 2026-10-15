import { useEffect, useRef } from "react";
import * as THREE from "three";

// Original particle sculpture: interference sheets morph into an orbital probability cloud.
export default function QuantumField({ motionEnabled, mode, phase }) {
  const ref = useRef(null);
  const settings = useRef({ motionEnabled, mode, phase });
  useEffect(() => { settings.current = { motionEnabled, mode, phase }; }, [motionEnabled, mode, phase]);
  useEffect(() => {
    const host = ref.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" }); } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 50);
    camera.position.set(0, 1, 9.7);
    camera.lookAt(0, 0, 0);
    const count = window.innerWidth < 600 ? 5200 : 11000;
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 3);
    for (let i = 0; i < seeds.length; i++) { const n = Math.sin(i * 127.1 + 311.7) * 43758.5453; seeds[i] = n - Math.floor(n); }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { u_dpr: { value: renderer.getPixelRatio() } },
      vertexShader: "uniform float u_dpr; varying float v_alpha; void main(){vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=clamp(12./-p.z,1.,3.)*u_dpr;v_alpha=clamp(1.2+p.z*.065,.2,.85);}",
      fragmentShader: "varying float v_alpha; void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(.9,.92,.95,(1.-smoothstep(.15,.5,d))*v_alpha);}",
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    let time = 0, morph = 0, currentPhase = 0, frame, last = 0, visible = true, dirty = true;
    const pointer = new THREE.Vector2();
    const onPointer = (event) => { const box = host.getBoundingClientRect(); pointer.set((event.clientX - box.left) / box.width - .5, (event.clientY - box.top) / box.height - .5); };
    const resetPointer = () => pointer.set(0, 0);
    host.addEventListener("pointermove", onPointer); host.addEventListener("pointerleave", resetPointer);
    host.addEventListener("pointercancel", resetPointer); host.addEventListener("pointerup", resetPointer);
    const resize = () => { renderer.setSize(host.clientWidth, host.clientHeight); camera.aspect = host.clientWidth / host.clientHeight; camera.position.z = Math.max(9.7, 10.4 / camera.aspect); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); dirty = true; };
    const observer = new ResizeObserver(resize); observer.observe(host);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); intersection.observe(host);
    const draw = (now) => {
      frame = requestAnimationFrame(draw);
      const dt = Math.min((now - last) / 1000, .04); last = now;
      if (!visible || document.hidden) return;
      const { motionEnabled: moving, mode: target, phase: targetPhase } = settings.current;
      if (!moving && !dirty && morph === target && currentPhase === targetPhase) return;
      if (moving) time += dt;
      morph = moving ? THREE.MathUtils.damp(morph, target, 4, dt) : target;
      currentPhase = moving ? THREE.MathUtils.damp(currentPhase, targetPhase, 6, dt) : targetPhase;
      const p = currentPhase * Math.PI / 180;
      for (let i = 0; i < count; i++) {
        const j = i * 3, a = seeds[j], b = seeds[j + 1], c = seeds[j + 2];
        const x = (a - .5) * 8, z = (b - .5) * 5;
        const r1 = Math.hypot(x - 1.3, z), r2 = Math.hypot(x + 1.3, z);
        const wave = (Math.sin(r1 * 2.5 - time * .8) + Math.sin(r2 * 2.5 - time * .8 + p)) * .33;
        const theta = a * Math.PI * 2, phi = Math.acos(2 * b - 1);
        const radius = 1.3 + Math.abs(Math.cos(phi * 2 + p)) * 1.25 + (c - .5) * .22;
        const ox = radius * Math.sin(phi) * Math.cos(theta), oy = radius * Math.cos(phi), oz = radius * Math.sin(phi) * Math.sin(theta);
        positions[j] = x * (1 - morph) + ox * morph;
        positions[j + 1] = (wave + (c - .5) * .08) * (1 - morph) + oy * morph;
        positions[j + 2] = z * (1 - morph) + oz * morph;
      }
      geometry.attributes.position.needsUpdate = true;
      points.rotation.x = moving ? -.22 + pointer.y * .12 : -.22;
      points.rotation.y = moving ? Math.sin(time * .12) * .15 + pointer.x * .2 : 0;
      renderer.render(scene, camera); dirty = false;
    };
    resize(); frame = requestAnimationFrame(draw);
    host.dataset.ready = "true";
    return () => { cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); host.removeEventListener("pointermove", onPointer); host.removeEventListener("pointerleave", resetPointer); host.removeEventListener("pointercancel", resetPointer); host.removeEventListener("pointerup", resetPointer); geometry.dispose(); material.dispose(); renderer.dispose(); renderer.domElement.remove(); };
  }, []);
  return <div className="quantum-field" ref={ref} aria-hidden="true" />;
}
