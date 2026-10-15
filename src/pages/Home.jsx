import { useLayoutEffect, useRef } from "react";
import Hero from "../components/hero/Hero";
import About from "../components/sections/About";
import VisionMission from "../components/sections/VisionMission";
import Technology from "../components/sections/Technology";
import Industries from "../components/sections/Industries";
import CTA from "../components/sections/CTA";
import { createScrollReveals } from "../animations/gsap/scroll";

export default function Home({ motionEnabled, toggleMotion }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!motionEnabled) return;
    const context = createScrollReveals(ref.current);
    return () => context.revert();
  }, [motionEnabled]);
  return (
    <main id="main" ref={ref}>
      <Hero
        motionEnabled={motionEnabled}
        toggleMotion={toggleMotion}
      />
      <About motionEnabled={motionEnabled} />
      <Technology motionEnabled={motionEnabled} />
      <VisionMission motionEnabled={motionEnabled} />
      <Industries />
      <CTA />
    </main>
  );
}
