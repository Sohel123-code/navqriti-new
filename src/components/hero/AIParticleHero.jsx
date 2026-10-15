import { useEffect, useRef, useState } from "react";

// The published particle scene used by the supplied Framer reference.
// Runtime, scene, models and textures are served locally.
let runtime;
function loadRuntime() {
  if (!runtime) runtime = new Promise((resolve, reject) => {
    if (window.UnicornStudio?.addScene) return resolve(window.UnicornStudio);
    const script = document.createElement("script");
    script.src = "/vendor/unicornStudio.umd.js";
    script.onload = () => resolve(window.UnicornStudio);
    script.onerror = () => { runtime = null; script.remove(); reject(new Error("Scene unavailable")); };
    document.head.appendChild(script);
  });
  return runtime;
}

export default function AIParticleHero({ motionEnabled }) {
  const host = useRef(null);
  const scene = useRef(null);
  const enabled = useRef(motionEnabled);
  const [ready, setReady] = useState(false);
  useEffect(() => { enabled.current = motionEnabled; if (scene.current) scene.current.paused = !motionEnabled || document.hidden; }, [motionEnabled]);
  useEffect(() => {
    let disposed = false;
    let visible = true;
    const update = () => { if (scene.current) scene.current.paused = !enabled.current || !visible || document.hidden; };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(host.current);
    document.addEventListener("visibilitychange", update);
    loadRuntime().then(async (api) => {
      if (disposed) return;
      const instance = await api.addScene({ elementId: "ai-orb-canvas", filePath: "/models/ai/particle-orb.json", fps: 30, dpi: Math.min(window.devicePixelRatio, 1.5), scale: .75, interactivity: { mouse: { disableMobile: true } } });
      if (disposed) { instance.destroy(); return; }
      scene.current = instance;
      update();
      setReady(true);
    }).catch(() => { /* The static poster remains visible. */ });
    return () => { disposed = true; observer.disconnect(); document.removeEventListener("visibilitychange", update); scene.current?.destroy(); scene.current = null; };
  }, []);
  return <div ref={host} className={`ai-orb ${ready ? "is-ready" : ""}`} aria-hidden="true">
    <img src="/images/ai/orb-poster.png" alt="" className="ai-orb-poster" fetchPriority="high" />
    <div id="ai-orb-canvas" />
  </div>;
}
