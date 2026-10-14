import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import useMousePosition from "../../hooks/useMousePosition";
import useSceneReady from "../../hooks/useSceneReady";
import SceneBoundary from "../ui/SceneBoundary";
const HeroScene = lazy(() => import("../../three/scenes/HeroScene"));
const phases = [
  { title: "Discover", detail: "New questions. New possibilities." },
  { title: "Create", detail: "Knowledge becomes capability." },
  { title: "Deploy", detail: "Technology meets the real world." },
];

export default function HeroVisual({ heroRef, motionEnabled, toggleMotion }) {
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const pointer = useMousePosition(heroRef, motionEnabled);
  const sceneReady = useSceneReady(heroRef, 900);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => {
    setFailed(true);
    setReady(false);
  }, []);
  useEffect(() => {
    if (!motionEnabled || (!ready && !failed)) return;
    let timer;
    let visible = false;
    const restart = () => {
      clearInterval(timer);
      if (visible && !document.hidden) {
        timer = setInterval(
          () => setStage((current) => (current + 1) % phases.length),
          3000,
        );
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        restart();
      },
      { threshold: 0.15 },
    );
    observer.observe(heroRef.current);
    document.addEventListener("visibilitychange", restart);
    return () => {
      clearInterval(timer);
      observer.disconnect();
      document.removeEventListener("visibilitychange", restart);
    };
  }, [motionEnabled, ready, failed, heroRef, stage]);
  return (
    <div className={`hero-visual ${ready ? "is-ready" : ""}`} data-hero-visual>
      <div className="visual-cross cross-one" aria-hidden="true">
        +
      </div>
      <div className="visual-cross cross-two" aria-hidden="true">
        +
      </div>
      <div className="orbital-guide" aria-hidden="true" />
      <div className="visual-topline mono">
        <span>THE NAVQRITI CONTINUUM</span>
        <span>FIG. 001</span>
      </div>
      <picture className="hero-scene-poster" aria-hidden="true">
        <source
          media="(max-width: 650px)"
          srcSet="/images/hero/navqriti-orbit-mobile.png"
        />
        <img
          src="/images/hero/navqriti-orbit.png"
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      {!failed && sceneReady && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <HeroScene
              stage={stage}
              motionEnabled={motionEnabled}
              pointer={pointer}
              onReady={onReady}
              onError={onError}
            />
          </Suspense>
        </SceneBoundary>
      )}
      <div className="scene-label label-research">
        <span className="tiny-dot" />
        RESEARCH
        <span className="leader" />
      </div>
      <div className="scene-label label-impact">
        <span className="leader" />
        REAL-WORLD IMPACT
        <span className="tiny-dot" />
      </div>
      <div className="visual-controls">
        <div
          className="phase-picker"
          aria-label="Explore the NavQriti philosophy"
        >
          {phases.map((phase, index) => (
            <button
              key={phase.title}
              onClick={() => setStage(index)}
              aria-pressed={stage === index}
              className={stage === index ? "active" : ""}
            >
              <span className="mono">0{index + 1}</span>
              {phase.title}
            </button>
          ))}
        </div>
        <div className="visual-caption">
          <p>{phases[stage].detail}</p>
          <button
            onClick={toggleMotion}
            aria-label={
              motionEnabled ? "Pause animations" : "Enable animations"
            }
            title={motionEnabled ? "Pause animations" : "Enable animations"}
          >
            {motionEnabled ? <Pause size={13} /> : <Play size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}
