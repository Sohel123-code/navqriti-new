import { useEffect } from "react";

// Cross-page anchors can arrive before React (or a lazy detail page) has mounted.
export default function useHashNavigation() {
  useEffect(() => {
    let observer;
    let frame;
    let generation = 0;
    const navigate = () => {
      const current = ++generation;
      observer?.disconnect();
      cancelAnimationFrame(frame);
      let id;
      try { id = decodeURIComponent(window.location.hash.slice(1)); }
      catch { return; }
      if (!id) return;
      const locate = () => {
        const target = document.getElementById(id);
        if (!target) return;
        observer?.disconnect();
        document.fonts.ready.then(() => {
          if (current !== generation) return;
          frame = requestAnimationFrame(() => {
            target.scrollIntoView({ behavior: "instant", block: "start" });
          });
        });
      };
      observer = new MutationObserver(locate);
      observer.observe(document.getElementById("root"), { childList: true, subtree: true });
      locate();
    };
    navigate();
    window.addEventListener("hashchange", navigate);
    return () => {
      generation++;
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", navigate);
    };
  }, []);
}
