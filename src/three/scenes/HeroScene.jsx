import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createGlobe } from "../objects/Globe";
import { createNetwork } from "../objects/Network";
import { createParticles } from "../objects/Particles";
import { getSceneScroll } from "../../animations/gsap/parallax";

export default function HeroScene({
  stage,
  motionEnabled,
  pointer,
  onReady,
  onError,
}) {
  const hostRef = useRef(null);
  const stateRef = useRef({ stage, motionEnabled });
  useEffect(() => {
    stateRef.current = { stage, motionEnabled };
  }, [stage, motionEnabled]);

  useEffect(() => {
    const host = hostRef.current;
    const scroll = getSceneScroll(host);
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      onError();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0xf7f7f5, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.6;
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0.3, 9.6);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04, 0.1, 100, { size: 128 });
    scene.environment = env.texture;
    room.dispose();
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 5);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);
    const globe = createGlobe();
    const network = createNetwork();
    const sculpture = new THREE.Group();
    sculpture.add(globe.group, network.group);
    sculpture.rotation.set(0.12, 0, -0.28);
    scene.add(sculpture);
    const particles = createParticles();
    scene.add(particles);
    let visible = true;
    let pageVisible = !document.hidden;
    let frame;
    let lastTime = 0;
    let elapsed = 0;
    let previousStage = stage;
    let needsRender = true;
    let ready = false;
    let cameraDistance = 9.6;
    const targetScale = new THREE.Vector3();
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      cameraDistance = width < 400 ? 10.8 : 9.6;
      camera.position.z = cameraDistance;
      camera.updateProjectionMatrix();
      needsRender = true;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      needsRender = true;
    });
    visibility.observe(host);
    const changeVisibility = () => {
      pageVisible = !document.hidden;
    };
    const contextLost = (event) => {
      event.preventDefault();
      onError();
    };
    document.addEventListener("visibilitychange", changeVisibility);
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    resize();
    const render = (time) => {
      frame = requestAnimationFrame(render);
      const delta = Math.min((time - lastTime) / 1000 || 0, 0.05);
      lastTime = time;
      const state = stateRef.current;
      if (state.stage !== previousStage) {
        previousStage = state.stage;
        needsRender = true;
      }
      if (!visible || !pageVisible || (!state.motionEnabled && !needsRender))
        return;
      if (state.motionEnabled) elapsed += delta;
      const blend = state.motionEnabled ? 1 - Math.exp(-delta * 5) : 1;
      const travel = state.motionEnabled ? scroll.offset * scroll.strength : 0;
      camera.position.set(
        travel * 0.75,
        0.3 + travel * 0.55,
        cameraDistance + travel * 1.4,
      );
      camera.lookAt(0, 0, 0);
      sculpture.rotation.y = THREE.MathUtils.lerp(
        sculpture.rotation.y,
        (state.motionEnabled ? pointer.current.x * 0.25 : 0) +
          Math.sin(elapsed * 0.14) * 0.2 +
          travel * 0.65,
        blend,
      );
      sculpture.rotation.x = THREE.MathUtils.lerp(
        sculpture.rotation.x,
        0.12 +
          (state.motionEnabled
            ? pointer.current.y * 0.16 + travel * 0.25 + scroll.velocity * 0.08
            : 0),
        blend,
      );
      sculpture.position.y = Math.sin(elapsed * 0.65) * 0.08;
      particles.rotation.y = elapsed * 0.025;
      particles.rotation.z = Math.sin(elapsed * 0.1) * 0.06;
      globe.rings.forEach((ring, i) => {
        ring.rotation.z = i * 0.7 + elapsed * (i % 2 ? -0.09 : 0.07);
      });
      globe.core.rotation.y = elapsed * 0.16;
      globe.wire.rotation.y = -elapsed * 0.08;
      network.nodes.forEach(({ mesh, positions }, i) => {
        mesh.position.lerp(positions[state.stage], blend);
        mesh.rotation.set(elapsed * 0.16 + i, elapsed * 0.12, i);
      });
      const scale = state.stage === 1 ? 0.68 : 1;
      globe.core.scale.lerp(targetScale.setScalar(scale), blend);
      renderer.render(scene, camera);
      if (!ready) {
        ready = true;
        onReady();
      }
      needsRender = false;
    };
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", changeVisibility);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      const geometries = new Set();
      const materials = new Set();
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material)
          (Array.isArray(object.material)
            ? object.material
            : [object.material]
          ).forEach((material) => materials.add(material));
      });
      geometries.forEach((geometry) => geometry.dispose());
      materials.forEach((material) => material.dispose());
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
    // A single scene owns its GPU resources; live props arrive through refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pointer, onReady, onError]);
  return <div className="hero-canvas" ref={hostRef} aria-hidden="true" />;
}
