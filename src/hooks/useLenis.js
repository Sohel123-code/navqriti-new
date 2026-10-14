import { useEffect } from "react";
import Lenis from "lenis";

export default function useLenis(motionEnabled) {
  useEffect(() => {
    if (!motionEnabled) return;
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      anchors: { offset: -85 },
    });
    let frame;
    const tick = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [motionEnabled]);
}
