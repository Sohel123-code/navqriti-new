import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import useAutoCycle from "../../hooks/useAutoCycle";
import useSceneReady from "../../hooks/useSceneReady";
import SceneBoundary from "../ui/SceneBoundary";

const NameScene = lazy(() => import("../../three/scenes/NameScene"));
const meanings = [
  ["NavQriti", "One connected purpose."],
  ["Nav", "New thinking."],
  ["Q", "Future intelligence."],
  ["Kriti", "Purposeful creation."],
];

export default function NameStory({ motionEnabled }) {
  const ref = useRef(null);
  const sceneReady = useSceneReady(ref);
  const [formed, setFormed] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const onFormationComplete = useCallback(() => setFormed(true), []);
  const onSceneError = useCallback(() => {
    setSceneFailed(true);
    setFormed(true);
  }, []);
  const { active, setActive, paused, toggle } = useAutoCycle(
    ref,
    4,
    motionEnabled && formed,
    4000,
  );
  const fallback =
    !motionEnabled || sceneFailed ? (
      <span className="identity-fallback">{meanings[active][0]}</span>
    ) : (
      <div
        className={`identity-particle-preview ${paused ? "is-paused" : ""}`}
        aria-hidden="true"
      >
        {Array.from({ length: 36 }, (_, index) => (
          <i
            key={index}
            style={{
              left: `${10 + ((index * 37) % 80)}%`,
              top: `${18 + ((index * 23) % 60)}%`,
              animationDelay: `${-(index % 9) * 0.3}s`,
            }}
          />
        ))}
      </div>
    );
  return (
    <div
      className="identity-story"
      ref={ref}
      data-reveal="cinematic"
      data-identity={active}
      data-scroll-scene
    >
      <div className="identity-top mono">
        <span>THE THINKING BEHIND OUR NAME</span>
        <span>0{active + 1} / 04</span>
      </div>
      <div
        className="identity-visual"
        role="img"
        aria-label={`${meanings[active][0]}: ${meanings[active][1]}`}
      >
        {sceneReady && !sceneFailed ? (
          <SceneBoundary
            fallback={
              <span className="identity-fallback">{meanings[active][0]}</span>
            }
          >
            <Suspense fallback={fallback}>
              <NameScene
                active={active}
                motionEnabled={motionEnabled && !paused}
                animateIntro={motionEnabled}
                onFormationComplete={onFormationComplete}
                onSceneError={onSceneError}
                word={meanings[active][0]}
              />
            </Suspense>
          </SceneBoundary>
        ) : (
          fallback
        )}
        <p className="identity-caption" key={active}>
          {meanings[active][1]}
        </p>
      </div>
      <div className="identity-bottom">
        <nav aria-label="The meaning of NavQriti">
          {meanings.map(([name, meaning], index) => (
            <button
              key={name}
              onClick={() => setActive(index)}
              aria-pressed={active === index}
            >
              <span>{name}</span>
              <small>{meaning}</small>
            </button>
          ))}
        </nav>
        {motionEnabled && (
          <button
            className="frontier-pause"
            onClick={toggle}
            aria-label={paused ? "Play name animation" : "Pause name animation"}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>
        )}
      </div>
    </div>
  );
}
