import { useEffect, useState } from "react";

// Let the HTML paint first; allocate WebGL only near the visitor's viewport.
export default function useSceneReady(ref, delay = 120) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ready) return;
    let timer;
    let visible = false;
    const schedule = () => {
      clearTimeout(timer);
      if (!visible || document.documentElement.hasAttribute("data-route-changing")) return;
      timer = setTimeout(() => {
        if (document.documentElement.hasAttribute("data-route-changing")) return;
        setReady(true);
        observer.disconnect();
      }, delay);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        schedule();
      },
      { rootMargin: "160px" },
    );
    observer.observe(ref.current);
    document.addEventListener("navqriti:route-ready", schedule);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener("navqriti:route-ready", schedule);
    };
  }, [ref, ready, delay]);
  return ready;
}
