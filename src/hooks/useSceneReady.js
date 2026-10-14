import { useEffect, useState } from "react";

// Let the HTML paint first; allocate WebGL only near the visitor's viewport.
export default function useSceneReady(ref, delay = 120) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ready) return;
    let timer;
    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        if (entry.isIntersecting) {
          timer = setTimeout(() => {
            setReady(true);
            observer.disconnect();
          }, delay);
        }
      },
      { rootMargin: "160px" },
    );
    observer.observe(ref.current);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [ref, ready, delay]);
  return ready;
}
