import { lazy, Suspense, useLayoutEffect, useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import Container from "../ui/Container";
import HeroText from "./HeroText";
import HeroVisual from "./HeroVisual";
import { animateHero } from "../../animations/gsap/hero";
import useSceneReady from "../../hooks/useSceneReady";
import SceneBoundary from "../ui/SceneBoundary";
const ParticleScene = lazy(() => import("../../three/scenes/ParticleScene"));

export default function Hero({ motionEnabled, toggleMotion, onContact }) {
  const ref = useRef(null);
  const particlesReady = useSceneReady(ref, 1300);
  useLayoutEffect(() => {
    if (!motionEnabled) return;
    const animation = animateHero(ref.current);
    return () => animation.revert();
  }, [motionEnabled]);
  return (
    <section
      id="home"
      className="hero"
      data-scroll-scene
      ref={ref}
      aria-label="Creating what comes next"
    >
      {particlesReady && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <ParticleScene heroRef={ref} motionEnabled={motionEnabled} />
          </Suspense>
        </SceneBoundary>
      )}
      <Container>
        <div className="hero-main">
          <HeroText motionEnabled={motionEnabled} onContact={onContact} />
          <HeroVisual
            heroRef={ref}
            motionEnabled={motionEnabled}
            toggleMotion={toggleMotion}
          />
        </div>
        <div className="hero-bottom" data-hero-fade data-parallax="subtle">
          <p>
            Scientific curiosity.
            <br />
            <strong>Real-world possibility.</strong>
          </p>
          <div className="hero-disciplines mono">
            <span>RESEARCH</span>
            <span>TECHNOLOGY</span>
            <span>INNOVATION</span>
            <span>IMPACT</span>
          </div>
          <a href="#about" className="scroll-cue">
            <span className="mono">SCROLL TO DISCOVER</span>
            <ArrowDownRight size={23} />
          </a>
        </div>
      </Container>
    </section>
  );
}
