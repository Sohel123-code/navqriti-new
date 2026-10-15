import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { isPagePath, normalizePath, preloadPage } from "../../pages/pageLoaders";

// Keep the document, fonts and loaded modules alive between pages.
// Real hrefs still support refresh, new tabs and native same-page anchors.
export default function RouteTransition({ motionEnabled, onNavigate }) {
  const [transition, setTransition] = useState(null);
  const layer = useRef(null);
  const motion = useRef(motionEnabled);
  useEffect(() => { motion.current = motionEnabled; }, [motionEnabled]);
  useEffect(() => {
    let disposed = false;
    let sequence = 0;
    let currentPath = normalizePath(location.pathname);
    let entry = history.state?.navqritiEntry ?? crypto.randomUUID();
    const positions = new Map();
    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    history.replaceState({ ...history.state, navqritiEntry: entry }, "");
    let animation;
    let busy = false;
    const pendingFrames = new Set();
    const nextFrame = () => new Promise(resolve => {
      const id = requestAnimationFrame(() => { pendingFrames.delete(id); resolve(); });
      pendingFrames.add(id);
    });
    const paint = async () => { await nextFrame(); await nextFrame(); };
    const fade = async (from, to, duration) => {
      animation?.cancel();
      if (!layer.current || !motion.current) return;
      animation = layer.current.animate([{ opacity: from }, { opacity: to }], {
        duration, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards",
      });
      await animation.finished.catch(() => {});
    };
    const run = async (url, pop = false) => {
      const ticket = ++sequence;
      busy = true;
      const scrollY = document.body.style.position === "fixed" ? -(parseFloat(document.body.style.top) || 0) : window.scrollY;
      positions.set(entry, scrollY);
      const nextPath = normalizePath(url.pathname);
      const nextEntry = pop ? history.state?.navqritiEntry : crypto.randomUUID();
      const restoreY = pop ? positions.get(nextEntry) ?? 0 : 0;
      document.querySelectorAll("dialog[open]").forEach(dialog => dialog.close());
      const loading = preloadPage(nextPath);
      // Attach a handler immediately; failures fall back to native navigation.
      const prepared = loading.then(() => true, () => false);
      if (motion.current) {
        flushSync(() => setTransition({ home: nextPath === "/", label: nextPath === "/" ? "Home" : nextPath === "/contact" ? "Partner with us" : nextPath === "/ai" ? "AI" : "Quantum" }));
        await fade(0, 1, 160);
      }
      const ready = await prepared;
      if (disposed || ticket !== sequence) return;
      if (!ready) { location.assign(url.href); return; }
      if (!pop) history.pushState({ navqritiEntry: nextEntry }, "", url.href);
      entry = nextEntry ?? crypto.randomUUID();
      if (!nextEntry) history.replaceState({ ...history.state, navqritiEntry: entry }, "");
      currentPath = nextPath;
      document.documentElement.toggleAttribute("data-route-changing", true);
      flushSync(() => onNavigate(nextPath));
      await paint();
      if (disposed || ticket !== sequence) return;
      let target;
      try { target = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1))); } catch { /* Invalid fragments leave the page usable. */ }
      if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
      else window.scrollTo({ top: restoreY, behavior: "instant" });
      const main = document.querySelector("main");
      if (main) { main.setAttribute("tabindex", "-1"); main.focus({ preventScroll: true }); }
      // Lenis follows the same immediate position instead of easing from the old route.
      document.dispatchEvent(new CustomEvent("navqriti:route-position", { detail: window.scrollY }));
      await fade(1, 0, 240);
      if (disposed || ticket !== sequence) return;
      setTransition(null);
      document.documentElement.removeAttribute("data-route-changing");
      document.dispatchEvent(new Event("navqriti:route-ready"));
      busy = false;
    };
    const linkURL = event => {
      const link = event.target.closest?.("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !isPagePath(url.pathname)) return;
      return url;
    };
    const prefetch = event => {
      const url = linkURL(event);
      if (url && normalizePath(url.pathname) !== currentPath) preloadPage(url.pathname).catch(() => {});
    };
    const click = event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const url = linkURL(event);
      if (!url || normalizePath(url.pathname) === currentPath) return;
      event.preventDefault();
      if (!busy) void run(url);
    };
    const pop = () => {
      const url = new URL(location.href);
      if (!isPagePath(url.pathname)) { location.reload(); return; }
      if (normalizePath(url.pathname) === currentPath && !busy) return;
      void run(url, true);
    };
    document.addEventListener("click", click);
    document.addEventListener("pointerover", prefetch, { passive: true });
    document.addEventListener("focusin", prefetch);
    document.addEventListener("touchstart", prefetch, { passive: true });
    window.addEventListener("popstate", pop);
    return () => {
      disposed = true;
      sequence++;
      animation?.cancel();
      pendingFrames.forEach(cancelAnimationFrame);
      document.documentElement.removeAttribute("data-route-changing");
      history.scrollRestoration = previousRestoration;
      document.removeEventListener("click", click);
      document.removeEventListener("pointerover", prefetch);
      document.removeEventListener("focusin", prefetch);
      document.removeEventListener("touchstart", prefetch);
      window.removeEventListener("popstate", pop);
    };
  }, [onNavigate]);
  if (!transition) return null;
  return <div ref={layer} className={`route-transition ${transition.home ? "route-transition--home" : ""}`} role="status" aria-label={`Opening NavQriti ${transition.label}`}>
    <span className="route-transition-mark" aria-hidden="true">NavQriti<span> / {transition.label}</span></span>
  </div>;
}
