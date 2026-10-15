import { useEffect, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

export default function useScrollSequence(ref, count, enabled) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 100px", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!enabled) return;
    setPlaying(false);
    setActive(Math.min(count - 1, Math.floor(Math.max(0, value) * count)));
  });
  useEffect(() => {
    if (!playing || !enabled) return;
    const timer = setInterval(() => {
      const box = ref.current.getBoundingClientRect();
      if (!document.hidden && box.top < innerHeight && box.bottom > 100)
        setActive((value) => (value + 1) % count);
    }, 3000);
    return () => clearInterval(timer);
  }, [playing, enabled, count, ref]);
  const select = (index) => {
    setPlaying(false);
    setActive(index);
    if (!enabled) return;
    const top = ref.current.getBoundingClientRect().top + scrollY - 100;
    const range = ref.current.offsetHeight - innerHeight + 100;
    window.scrollTo({ top: top + range * ((index + .35) / count), behavior: "instant" });
  };
  return { active, select, playing: playing && enabled, toggle: () => setPlaying((value) => !value) };
}
