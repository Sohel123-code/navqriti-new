import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { getSceneScroll } from "../../animations/gsap/parallax";

export default function FrontierScene({ active, motionEnabled }) {
  const hostRef = useRef(null);
  const state = useRef({ active, motionEnabled });
  useEffect(() => {
    state.current = { active, motionEnabled };
  }, [active, motionEnabled]);
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
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor(0xffffff, 0);
    host.appendChild(renderer.domElement);
    host.dataset.ready = "true";
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    camera.position.set(0, 0.2, 9.5);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.04, 0.1, 100, { size: 128 });
    scene.environment = environment.texture;
    room.dispose();
    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const light = new THREE.DirectionalLight(0xffffff, 4);
    light.position.set(3, 5, 6);
    scene.add(light);
    const sculpture = new THREE.Group();
    scene.add(sculpture);
    const count = 648;
    const targets = [[], [], []];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = i * 2.39996;
      const radius = 1.7 + 0.3 * Math.sin(theta * 3) * Math.sin(phi * 4);
      targets[0].push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta),
        ),
      );
      const t = ((i % 216) / 216) * Math.PI * 2;
      const strand = (Math.floor(i / 216) * Math.PI * 2) / 3;
      const r = 1.45 + 0.48 * Math.cos(3 * t + strand);
      targets[1].push(
        new THREE.Vector3(
          r * Math.cos(2 * t),
          r * Math.sin(2 * t),
          0.65 * Math.sin(3 * t + strand),
        ),
      );
      const x = i % 9,
        y = Math.floor(i / 9) % 9,
        z = Math.floor(i / 81);
      targets[2].push(
        new THREE.Vector3((x - 4) * 0.38, (y - 4) * 0.38, (z - 3.5) * 0.38),
      );
    }
    const geometry = new THREE.SphereGeometry(1, 10, 8);
    const material = new THREE.MeshStandardMaterial({
      color: 0x3b3b3b,
      metalness: 0.85,
      roughness: 0.24,
    });
    const nodes = new THREE.InstancedMesh(geometry, material, count);
    nodes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    nodes.frustumCulled = false;
    sculpture.add(nodes);
    const positions = targets[0].map((position) => position.clone());
    const edges = new Float32Array(count * 6);
    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(edges, 3).setUsage(THREE.DynamicDrawUsage),
    );
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x555555,
      transparent: true,
      opacity: 0.19,
    });
    const connections = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    connections.frustumCulled = false;
    sculpture.add(connections);
    const guideGeometry = new THREE.TorusGeometry(2.35, 0.003, 3, 140);
    const guideMaterial = new THREE.MeshBasicMaterial({ color: 0xbebebb });
    const guide = new THREE.Mesh(guideGeometry, guideMaterial);
    guide.rotation.x = Math.PI / 2.5;
    guide.position.y = -0.6;
    scene.add(guide);
    const dummy = new THREE.Object3D();
    const pointer = { x: 0, y: 0 };
    let cameraDistance = 9.5;
    const move = (event) => {
      const box = host.getBoundingClientRect();
      pointer.x = ((event.clientX - box.left) / box.width - 0.5) * 0.45;
      pointer.y = ((event.clientY - box.top) / box.height - 0.5) * 0.3;
    };
    const leave = () => {
      pointer.x = pointer.y = 0;
    };
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    let visible = false,
      lost = false,
      dirty = true,
      frame,
      last = 0,
      elapsed = 0,
      previousStage = -1;
    const resize = () => {
      const box = host.getBoundingClientRect();
      renderer.setSize(box.width, box.height);
      camera.aspect = box.width / Math.max(box.height, 1);
      cameraDistance = camera.aspect < 1.15 ? 11.5 : 9.5;
      camera.position.z = cameraDistance;
      camera.updateProjectionMatrix();
      dirty = true;
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(host);
    const contextLost = (event) => {
      event.preventDefault();
      lost = true;
      delete host.dataset.ready;
    };
    const contextRestored = () => {
      lost = false;
      dirty = true;
      host.dataset.ready = "true";
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      contextRestored,
    );
    resize();
    const render = (time) => {
      frame = requestAnimationFrame(render);
      const delta = Math.min((time - last) / 1000 || 0, 0.05);
      last = time;
      const current = state.current;
      if (current.active !== previousStage) {
        dirty = true;
        previousStage = current.active;
      }
      if (
        !visible ||
        document.hidden ||
        lost ||
        (!current.motionEnabled && !dirty)
      )
        return;
      if (current.motionEnabled) elapsed += delta;
      const blend = current.motionEnabled ? 1 - Math.exp(-delta * 3.4) : 1;
      const travel = current.motionEnabled
        ? scroll.offset * scroll.strength
        : 0;
      camera.position.set(
        travel * 1.25,
        0.2 + travel * 1.15,
        cameraDistance + Math.abs(travel) * 1.6,
      );
      camera.lookAt(0, 0, 0);
      guide.rotation.z = travel * 0.4;
      for (let i = 0; i < count; i++)
        positions[i].lerp(targets[current.active][i], blend);
      for (let i = 0; i < count; i++) {
        dummy.position.copy(positions[i]);
        const pulse = current.motionEnabled
          ? Math.sin(elapsed * 1.3 + i * 0.1)
          : 0;
        dummy.scale.setScalar(
          current.active === 1 ? 0.053 : 0.039 + pulse * 0.008,
        );
        dummy.updateMatrix();
        nodes.setMatrixAt(i, dummy.matrix);
        const neighbour =
          positions[(i + (current.active === 0 ? 21 : 1)) % count];
        positions[i].toArray(edges, i * 6);
        (positions[i].distanceTo(neighbour) < 1.15
          ? neighbour
          : positions[i]
        ).toArray(edges, i * 6 + 3);
      }
      nodes.instanceMatrix.needsUpdate = true;
      edgeGeometry.attributes.position.needsUpdate = true;
      sculpture.rotation.y =
        elapsed * 0.1 + (current.motionEnabled ? pointer.x : 0) + travel * 2.3;
      sculpture.rotation.x = THREE.MathUtils.lerp(
        sculpture.rotation.x,
        0.23 +
          (current.motionEnabled
            ? pointer.y + travel * 0.3 + scroll.velocity * 0.08
            : 0),
        0.08,
      );
      sculpture.rotation.z = THREE.MathUtils.lerp(
        sculpture.rotation.z,
        current.active === 2 ? Math.PI / 7 : Math.sin(elapsed * 0.15) * 0.08,
        blend,
      );
      renderer.render(scene, camera);
      dirty = false;
    };
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        contextRestored,
      );
      [
        geometry,
        material,
        edgeGeometry,
        edgeMaterial,
        guideGeometry,
        guideMaterial,
        environment,
      ].forEach((resource) => resource.dispose());
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      delete host.dataset.ready;
    };
  }, []);
  return (
    <div className="frontier-canvas" ref={hostRef} aria-hidden="true">
      <div className="frontier-fallback" />
    </div>
  );
}
