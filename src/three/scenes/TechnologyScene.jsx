import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getSceneScroll } from "../../animations/gsap/parallax";

export default function TechnologyScene({ progressRef }) {
  const hostRef = useRef(null);
  useEffect(() => {
    const host = hostRef.current;
    const scroll = getSceneScroll(host);
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 80);
    camera.position.z = 14;
    const count = 380;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions.set(
        [
          Math.sin(i * 43.13) * 13,
          Math.cos(i * 17.33) * 7,
          Math.sin(i * 7.17) * 12,
        ],
        i * 3,
      );
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uSpeed: { value: 0 },
        uRatio: { value: renderer.getPixelRatio() },
      },
      vertexShader: `
        uniform float uTime; uniform float uProgress; uniform float uSpeed; uniform float uRatio;
        varying float vOpacity;
        void main() {
          vec3 p = position;
          p.x += sin(uTime * 0.14 + p.y) * 0.24;
          p.y += cos(uTime * 0.1 + p.x) * 0.2;
          p.z = mod(p.z + uProgress * 8.0 + uTime * 0.14 + 12.0, 24.0) - 12.0;
          vec4 viewPosition = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * viewPosition;
          gl_PointSize = clamp(16.0 / -viewPosition.z, 0.8, 2.4) * uRatio * (1.0 + uSpeed * 0.15);
          vOpacity = 0.2 + 0.28 * sin(position.x * 4.0 + uTime * 0.3) * sin(position.x * 4.0 + uTime * 0.3);
        }`,
      fragmentShader: `varying float vOpacity; void main() { float edge = 1.0 - smoothstep(0.25, 0.5, length(gl_PointCoord - 0.5)); gl_FragColor = vec4(vec3(1.0), vOpacity * edge); }`,
      transparent: true,
      depthWrite: false,
    });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
    const continuum = new THREE.Group();
    const arcGeometry = new THREE.TorusGeometry(4.4, 0.008, 3, 160);
    const arcMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.13,
    });
    for (let i = 0; i < 3; i++) {
      const arc = new THREE.Mesh(arcGeometry, arcMaterial);
      arc.rotation.set(i * 0.7 + 0.6, i * 0.8, i * 0.4);
      arc.scale.y = 0.6;
      continuum.add(arc);
    }
    scene.add(continuum);
    let visible = false;
    let pageVisible = !document.hidden;
    let frame;
    let elapsed = 0;
    let lastTime = 0;
    let lost = false;
    const resize = () => {
      const bounds = host.getBoundingClientRect();
      renderer.setSize(bounds.width, bounds.height);
      camera.aspect = bounds.width / Math.max(bounds.height, 1);
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(host);
    const pageChange = () => {
      pageVisible = !document.hidden;
    };
    const contextLost = (event) => {
      event.preventDefault();
      lost = true;
    };
    const contextRestored = () => {
      lost = false;
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      contextRestored,
    );
    document.addEventListener("visibilitychange", pageChange);
    resize();
    const render = (time) => {
      frame = requestAnimationFrame(render);
      const delta = Math.min((time - lastTime) / 1000 || 0, 0.05);
      lastTime = time;
      if (!visible || !pageVisible || lost || !progressRef.current.running)
        return;
      elapsed += delta;
      material.uniforms.uTime.value = elapsed;
      material.uniforms.uProgress.value = progressRef.current.progress;
      material.uniforms.uSpeed.value = Math.abs(scroll.velocity);
      const travel = scroll.offset * scroll.strength;
      camera.position.x =
        Math.sin(progressRef.current.progress * Math.PI) * 0.7 + travel * 0.8;
      camera.position.y = travel * 1.1;
      camera.position.z = 14 + Math.abs(travel) * 1.8;
      camera.lookAt(0, 0, 0);
      stars.rotation.y = travel * 0.14;
      continuum.rotation.x = travel * 0.35;
      continuum.rotation.y =
        elapsed * 0.07 + progressRef.current.progress * Math.PI;
      continuum.rotation.z = Math.sin(elapsed * 0.1) * 0.2;
      continuum.scale.setScalar(
        1 + Math.sin(progressRef.current.progress * Math.PI * 2) * 0.12,
      );
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", pageChange);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        contextRestored,
      );
      geometry.dispose();
      material.dispose();
      arcGeometry.dispose();
      arcMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [progressRef]);
  return <div ref={hostRef} className="showcase-webgl" aria-hidden="true" />;
}
