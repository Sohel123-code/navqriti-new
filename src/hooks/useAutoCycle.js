import { useEffect, useState } from "react";

export default function useAutoCycle(ref, count, enabled, interval = 4500) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!enabled || paused) return;
    let timer;
    let visible = false;
    const sync = () => {
      clearInterval(timer);
      if (visible && !document.hidden)
        timer = setInterval(
          () => setActive((value) => (value + 1) % count),
          interval,
        );
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    observer.observe(ref.current);
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearInterval(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ref, count, enabled, interval, paused, active]);
  return {
    active,
    setActive,
    paused,
    toggle: () => setPaused((value) => !value),
  };
}
