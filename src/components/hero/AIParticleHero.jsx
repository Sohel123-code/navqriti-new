import { useEffect, useRef, useState } from "react";
import useSceneReady from "../../hooks/useSceneReady";

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

// One bounded scene cache for the document. The vendor asynchronously loads model
// renderers after addScene resolves; destroying midway leaves callbacks targeting
// a disposed renderer. Pause and detach on route exit, reuse on return instead.
let orb;
function getOrb() {
  if (!orb) {
    const element = document.createElement("div");
    element.className = "ai-orb-canvas";
    orb = { element, instance: null, loading: null };
  }
  return orb;
}
function assetsReady(instance) {
  return instance?.curtain?.canvas && !instance.curtain.gl?.isContextLost() && instance.layers.every(layer => {
    if (layer.isModel && !layer.local.modelLoaded) return false;
    return !layer.isFlattened || (layer.areModelAssetsReady() && layer.areImageAssetsReady() && layer.areTextAssetsReady());
  });
}

export default function AIParticleHero({ motionEnabled }) {
  const host = useRef(null);
  const mount = useRef(null);
  const scene = useRef(null);
  const enabled = useRef(motionEnabled);
  const [ready, setReady] = useState(false);
  const sceneReady = useSceneReady(host, 650);
  useEffect(() => { enabled.current = motionEnabled; if (scene.current) scene.current.paused = !motionEnabled || document.hidden; }, [motionEnabled]);
  useEffect(() => {
    if (!sceneReady) return;
    let disposed = false;
    let visible = true;
    let timer;
    let frame;
    const cached = getOrb();
    mount.current.appendChild(cached.element);
    const update = () => {
      if (cached.instance) cached.instance.paused = !enabled.current || !visible || document.hidden || !cached.element.isConnected;
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(host.current);
    document.addEventListener("visibilitychange", update);
    const reveal = () => {
      if (disposed) return;
      if (cached.instance?.fallbackOnly) return;
      if (!assetsReady(cached.instance)) { timer = setTimeout(reveal, 80); return; }
      // Asset readiness precedes the first rendered frame. Keep the poster until
      // the canvas has had a chance to draw, then crossfade without a black gap.
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => { if (!disposed) setReady(true); });
      });
    };
    const lost = () => { setReady(false); };
    const restored = () => { clearTimeout(timer); cancelAnimationFrame(frame); reveal(); };
    cached.element.addEventListener("webglcontextlost", lost, true);
    cached.element.addEventListener("webglcontextrestored", restored, true);
    if (!cached.loading) {
      cached.loading = loadRuntime().then(api => api.addScene({
        element: cached.element, filePath: "/models/ai/particle-orb.json", fps: 30,
        dpi: Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1 : 1.25),
        scale: .6, interactivity: { mouse: { disableMobile: true } },
      })).then(instance => { cached.instance = instance; instance.paused = !cached.element.isConnected; return instance; }).catch(error => { cached.loading = null; throw error; });
    }
    cached.loading.then(instance => {
      if (disposed) return;
      scene.current = instance;
      window.dispatchEvent(new Event("resize"));
      update();
      reveal();
    }).catch(() => { /* Keep the poster and all page content usable. */ });
    return () => {
      disposed = true;
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      cached.element.removeEventListener("webglcontextlost", lost, true);
      cached.element.removeEventListener("webglcontextrestored", restored, true);
      if (cached.instance) cached.instance.paused = true;
      cached.element.remove();
      scene.current = null;
    };
  }, [sceneReady]);
  return <div ref={host} className={`ai-orb ${ready ? "is-ready" : ""}`} aria-hidden="true">
    <picture>
      <source media="(max-width: 767px)" srcSet="/images/ai/orb-poster-mobile.png" />
      <img src="/images/ai/orb-poster.png" alt="" className="ai-orb-poster" fetchPriority="high" decoding="async" />
    </picture>
    <div className="ai-orb-mount" ref={mount} />
  </div>;
}
