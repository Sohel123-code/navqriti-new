import { useLayoutEffect, useRef } from "react";
import Hero from "../components/hero/Hero";
import About from "../components/sections/About";
import Solutions from "../components/sections/Solutions";
import Technology from "../components/sections/Technology";
import Impact from "../components/sections/Impact";
import Industries from "../components/sections/Industries";
import CTA from "../components/sections/CTA";
import { createScrollReveals } from "../animations/gsap/scroll";

export default function Home({ motionEnabled, toggleMotion, onContact }) {
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
        onContact={onContact}
      />
      <About motionEnabled={motionEnabled} />
      <Technology onContact={onContact} motionEnabled={motionEnabled} />
      <Impact motionEnabled={motionEnabled} />
      <Industries onContact={onContact} />
      <CTA onContact={onContact} />
      <Solutions onContact={onContact} motionEnabled={motionEnabled} />
    </main>
  );
}
