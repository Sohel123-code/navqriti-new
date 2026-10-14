import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import StagePanel from "../cards/StagePanel";
import { researchStages } from "../../data/statistics";
import { createStageShowcase } from "../../animations/gsap/horizontalScroll";
import useSceneReady from "../../hooks/useSceneReady";
import SceneBoundary from "../ui/SceneBoundary";

const TechnologyScene = lazy(
  () => import("../../three/scenes/TechnologyScene"),
);

export default function Impact({ motionEnabled }) {
  const cinematicEnabled = motionEnabled;
  const sectionRef = useRef(null);
  const sceneReady = useSceneReady(sectionRef);
  const controllerRef = useRef(null);
  const progressRef = useRef({ progress: 0, velocity: 0, running: false });
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!cinematicEnabled || !sceneReady) return;
    const controller = createStageShowcase(
      sectionRef.current,
      progressRef,
      setActive,
      setPlaying,
    );
    controllerRef.current = controller;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [cinematicEnabled, sceneReady]);

  const seek = (index) => {
    if (controllerRef.current) controllerRef.current.seek(index);
    else
      document
        .querySelector('[data-panel="' + index + '"]')
        ?.scrollIntoView({ block: "center", behavior: "instant" });
  };

  return (
    <section
      id="approach"
      className={
        "impact-showcase " + (cinematicEnabled ? "" : "showcase-static")
      }
      ref={sectionRef}
      data-scroll-scene
      aria-labelledby="showcase-title"
    >
      <div className="showcase-pin">
        <div className="showcase-background" aria-hidden="true">
          {cinematicEnabled && sceneReady && (
            <SceneBoundary>
              <Suspense fallback={null}>
                <TechnologyScene progressRef={progressRef} />
              </Suspense>
            </SceneBoundary>
          )}
          <div className="showcase-floor" />
          <span className="showcase-ghost-number" data-parallax="backdrop">
            {researchStages[active].number}
          </span>
        </div>
        <div className="showcase-intro">
          <div className="showcase-topline">
            <SectionHeading number="03" light>
              RESEARCH TO IMPACT
            </SectionHeading>
            <span className="showcase-runtime mono">
              <i /> THE NAVQRITI CONTINUUM
            </span>
          </div>
          <div className="showcase-heading" data-parallax="subtle">
            <h2 id="showcase-title">
              Discover. Create. <span>Deploy.</span>
            </h2>
            <p>Six stages. One continuous journey.</p>
          </div>
        </div>
        <div
          className="showcase-stage"
          aria-hidden={cinematicEnabled || undefined}
        >
          <div className="showcase-panels" data-parallax="panels">
            {researchStages.map((stage, index) => (
              <StagePanel
                key={stage.number}
                stage={stage}
                index={index}
                motionEnabled={cinematicEnabled}
              />
            ))}
          </div>
          <span className="showcase-corner corner-tl" />
          <span className="showcase-corner corner-br" />
        </div>
        {cinematicEnabled && (
          <>
            <div className="showcase-caption-area">
              {researchStages.map((stage, index) => (
                <div
                  key={stage.number}
                  className="showcase-caption"
                  aria-hidden={active !== index}
                >
                  <span className="caption-step mono">{stage.number} / 06</span>
                  <h3>
                    {stage.title}
                    <span>.</span>
                  </h3>
                  <p>{stage.description}</p>
                </div>
              ))}
              <button
                className="showcase-play"
                onClick={() => controllerRef.current?.togglePlay()}
                aria-label={playing ? "Pause stage film" : "Play stage film"}
                aria-pressed={playing}
              >
                <span className="play-icon">
                  {playing ? <Pause size={16} /> : <Play size={16} />}
                </span>
                <span>{playing ? "Pause film" : "Play film"}</span>
              </button>
            </div>
            <div className="showcase-timeline">
              <div className="showcase-progress">
                <span className="showcase-progress-fill" />
              </div>
              <nav aria-label="Research to impact stages">
                {researchStages.map((stage, index) => (
                  <button
                    key={stage.number}
                    aria-current={active === index ? "step" : undefined}
                    className={active === index ? "active" : ""}
                    onClick={() => seek(index)}
                  >
                    <span className="mono">{stage.number}</span>
                    <span>{stage.title}</span>
                  </button>
                ))}
              </nav>
              <span className="showcase-scroll mono">
                {playing ? "AUTOMATIC SEQUENCE" : "SEQUENCE PAUSED"}
              </span>
            </div>
          </>
        )}
        <a className="showcase-skip" href="#collaborate">
          Continue to collaboration ↗
        </a>
      </div>
    </section>
  );
}
