import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getSceneScroll } from "../../animations/gsap/parallax";

const words = ["NavQriti", "Nav", "Q", "Kriti"];
function sampleWord(word) {
  const canvas = document.createElement("canvas");
  canvas.width = 1100;
  canvas.height = 280;
  const pen = canvas.getContext("2d", { willReadFrequently: true });
  pen.textAlign = "center";
  pen.textBaseline = "middle";
  pen.font = `${word === "Q" ? "italic 500" : "650"} ${word === "NavQriti" ? 190 : 230}px ${word === "Q" ? "Georgia" : '"Manrope Variable", Arial'}`;
  pen.fillText(word, 550, 135);
  const pixels = pen.getImageData(0, 0, 1100, 280).data;
  const points = [];
  for (let y = 10; y < 270; y += 3)
    for (let x = 10; x < 1090; x += 3) {
      if (pixels[(y * 1100 + x) * 4 + 3] > 100) points.push([x - 550, 140 - y]);
    }
  return points;
}

export default function NameScene({
  active,
  motionEnabled,
  animateIntro,
  word,
  onFormationComplete,
  onSceneError,
}) {
  const hostRef = useRef(null);
  const state = useRef({ active, motionEnabled, animateIntro });
  useEffect(() => {
    state.current = { active, motionEnabled, animateIntro };
  }, [active, motionEnabled, animateIntro]);
  useEffect(() => {
    const host = hostRef.current;
    const scroll = getSceneScroll(host);
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      onSceneError();
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0xffffff, 0);
    host.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-600, 600, 200, -200, 1, 2000);
    camera.position.z = 1000;
    const count = 6200;
    let targets = words.map(sampleWord);
    let disposed = false;
    document.fonts.ready.then(() => {
      if (!disposed) {
        targets = words.map(sampleWord);
        dirty = true;
      }
    });
    const positions = new Float32Array(count * 3);
    const source = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const driftPositions = new Float32Array(count * 3);
    const initialTarget = targets[state.current.active];
    for (let i = 0; i < count; i++) {
      const point = initialTarget[(i * 7919) % initialTarget.length];
      const radius = Math.sqrt((i + 0.5) / count);
      driftPositions[i * 3] = Math.cos(i * 2.39996) * radius * 490;
      driftPositions[i * 3 + 1] = Math.sin(i * 2.39996) * radius * 102;
      driftPositions[i * 3 + 2] = Math.sin(i * 3.71) * 140;
      positions[i * 3] = state.current.animateIntro
        ? driftPositions[i * 3]
        : point[0];
      positions[i * 3 + 1] = state.current.animateIntro
        ? driftPositions[i * 3 + 1]
        : point[1];
      positions[i * 3 + 2] = state.current.animateIntro
        ? driftPositions[i * 3 + 2]
        : Math.sin(i * 7.1) * 12;
      sizes[i] = 2.1 + (i % 4) * 0.22;
    }
    source.set(positions);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage),
    );
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uRatio: { value: renderer.getPixelRatio() },
        uScale: { value: 1 },
      },
      vertexShader: `attribute float aSize; uniform float uRatio; uniform float uScale; varying float shade; void main(){vec4 p=modelViewMatrix*vec4(position,1.); gl_Position=projectionMatrix*p; gl_PointSize=aSize*uRatio*uScale; shade=0.18+0.2*(sin(position.z*0.08)*0.5+0.5);}`,
      fragmentShader: `varying float shade; void main(){vec2 p=gl_PointCoord-.5; float r=length(p); if(r>.5)discard; float highlight=max(0.,1.-length(p-vec2(-.14,.16))*2.); gl_FragColor=vec4(vec3(shade+highlight*.18),1.-smoothstep(.35,.5,r));}`,
      transparent: true,
      depthWrite: false,
    });
    const cloud = new THREE.Points(geometry, material);
    cloud.frustumCulled = false;
    scene.add(cloud);
    let visible = false,
      lost = false,
      dirty = true,
      frame,
      last = 0,
      elapsed = 0,
      morph = 1,
      currentStage = state.current.active,
      opening = true,
      introTime = 0,
      previouslyEnabled = state.current.motionEnabled;
    const pointer = { x: 0, y: 0 };
    const move = (event) => {
      const box = host.getBoundingClientRect();
      pointer.x = (event.clientX - box.left) / box.width - 0.5;
      pointer.y = (event.clientY - box.top) / box.height - 0.5;
    };
    const leave = () => {
      pointer.x = pointer.y = 0;
    };
    const resize = () => {
      const box = host.getBoundingClientRect();
      renderer.setSize(box.width, box.height);
      camera.top = 600 / (box.width / Math.max(box.height, 1));
      camera.bottom = -camera.top;
      camera.updateProjectionMatrix();
      material.uniforms.uScale.value = Math.max(
        0.5,
        Math.min(box.width / 1050, 1.3),
      );
      dirty = true;
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      },
      { threshold: [0, 0.35] },
    );
    observer.observe(host);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    const contextLost = (event) => {
      event.preventDefault();
      lost = true;
      delete host.dataset.ready;
      onSceneError();
    };
    const restored = () => {
      lost = false;
      dirty = true;
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    renderer.domElement.addEventListener("webglcontextrestored", restored);
    resize();
    const render = (time) => {
      frame = requestAnimationFrame(render);
      const delta = Math.min((time - last) / 1000 || 0, 0.05);
      last = time;
      const current = state.current;
      if (current.motionEnabled !== previouslyEnabled) {
        previouslyEnabled = current.motionEnabled;
        if (!current.animateIntro) dirty = true;
      }
      if (current.active !== currentStage) {
        if (opening) {
          opening = false;
          onFormationComplete();
        }
        source.set(positions);
        morph = 0;
        currentStage = current.active;
        dirty = true;
      }
      if (
        !visible ||
        document.hidden ||
        lost ||
        (!current.motionEnabled && !dirty)
      )
        return;
      if (current.motionEnabled) {
        elapsed += delta;
        morph = Math.min(1, morph + delta / 1.15);
        if (opening) introTime += delta;
      } else if (!opening || !current.animateIntro) morph = 1;
      const introProgress = current.animateIntro
        ? THREE.MathUtils.smoothstep(introTime, 0.8, 2.3)
        : 1;
      const blend = opening
        ? introProgress
        : THREE.MathUtils.smoothstep(morph, 0, 1);
      const scatter = Math.sin((opening ? introProgress : morph) * Math.PI);
      const target = targets[currentStage];
      for (let i = 0; i < count; i++) {
        const point = target[(i * 7919) % target.length];
        const j = i * 3,
          angle = i * 2.39996;
        const fromX = opening
          ? driftPositions[j] + Math.sin(introTime * 1.2 + i * 0.03) * 20
          : source[j];
        const fromY = opening
          ? driftPositions[j + 1] + Math.cos(introTime + i * 0.04) * 14
          : source[j + 1];
        const fromZ = opening ? driftPositions[j + 2] : source[j + 2];
        positions[j] =
          THREE.MathUtils.lerp(fromX, point[0], blend) +
          Math.cos(angle) * scatter * 85;
        positions[j + 1] =
          THREE.MathUtils.lerp(fromY, point[1], blend) +
          Math.sin(angle) * scatter * 65;
        positions[j + 2] =
          THREE.MathUtils.lerp(fromZ, Math.sin(i * 7.1) * 12, blend) +
          Math.sin(angle * 2) * scatter * 160;
      }
      geometry.attributes.position.needsUpdate = true;
      const travel = current.motionEnabled
        ? scroll.offset * scroll.strength
        : 0;
      cloud.position.y = -travel * 22;
      cloud.scale.setScalar(1 - Math.abs(travel) * 0.04);
      const turn = current.motionEnabled
        ? Math.sin(elapsed * 0.35) * 0.035 + pointer.x * 0.12 + travel * 0.14
        : 0;
      cloud.rotation.y = THREE.MathUtils.lerp(cloud.rotation.y, turn, 0.07);
      cloud.rotation.x = THREE.MathUtils.lerp(
        cloud.rotation.x,
        current.motionEnabled
          ? pointer.y * 0.08 + travel * 0.07 + scroll.velocity * 0.06
          : 0,
        0.07,
      );
      renderer.render(scene, camera);
      host.dataset.phase = opening
        ? introTime < 0.8
          ? "drifting"
          : "forming"
        : "formed";
      if (opening && introProgress === 1) {
        opening = false;
        morph = 1;
        host.dataset.phase = "formed";
        onFormationComplete();
      }
      host.dataset.ready = "true";
      dirty = false;
    };
    frame = requestAnimationFrame(render);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.domElement.removeEventListener("webglcontextrestored", restored);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      delete host.dataset.ready;
      delete host.dataset.phase;
    };
  }, [onFormationComplete, onSceneError]);
  return (
    <div className="identity-canvas" ref={hostRef} aria-hidden="true">
      {!animateIntro && <span className="identity-fallback">{word}</span>}
    </div>
  );
}
