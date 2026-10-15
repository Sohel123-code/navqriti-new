import PartnerLink from "../ui/PartnerLink";
import { lazy, Suspense, useRef } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { technologies } from "../../data/solutions";
import useAutoCycle from "../../hooks/useAutoCycle";
import useSceneReady from "../../hooks/useSceneReady";
import SceneBoundary from "../ui/SceneBoundary";

const FrontierScene = lazy(() => import("../../three/scenes/FrontierScene"));
const labels = ["Intelligence", "Quantum", "Intelligent systems"];

export default function Technology({ motionEnabled }) {
  const frameRef = useRef(null);
  const sceneReady = useSceneReady(frameRef);
  const { active, setActive, paused, toggle } = useAutoCycle(
    frameRef,
    3,
    motionEnabled,
    2000,
  );
  const technology = technologies[active];
  return (
    <section
      id="frontiers"
      className="technology section-pad"
      data-scroll-scene
    >
      <Container>
        <SectionHeading number="02">OUR TECHNOLOGY FRONTIERS</SectionHeading>
        <div className="section-intro frontier-heading" data-reveal data-parallax="frontier-title">
          <h2>
            Frontier thinking.
            <br />
            <span className="muted">Grounded in purpose.</span>
          </h2>
          <p>Technology-led. Problem-driven.</p>
        </div>
        <div className="frontier-scroll-track" data-scroll-scene>
        <div
          className="frontier-frame cinematic-frame"
          data-parallax="frame"
          ref={frameRef}
          data-frontier={active}
          data-reveal="cinematic"
        >
          <div className="frontier-frame-top mono">
            <span>
              <i /> THE FRONTIER OBSERVATORY
            </span>
            <span>FORM / {technology.number}</span>
          </div>
          <div className="frontier-visual">
            {sceneReady ? (
              <SceneBoundary fallback={<div className="frontier-fallback" />}>
                <Suspense fallback={<div className="frontier-fallback" />}>
                  <FrontierScene
                    active={active}
                    motionEnabled={motionEnabled && !paused}
                  />
                </Suspense>
              </SceneBoundary>
            ) : (
              <div className="frontier-fallback" />
            )}
            <span className="frontier-axis mono">RESEARCH ↔ POSSIBILITY</span>
          </div>
          <div className="frontier-copy" key={technology.id}>
            <span className="frontier-number mono">/ {technology.number}</span>
            <p className="frontier-tags mono">{technology.tags}</p>
            <h3>{technology.title}</h3>
            <p className="frontier-description">{technology.description}</p>
            {technology.id !== "deeptech" ? <a className="underlined-link" href={technology.id === "quantum" ? "/quantum" : "/ai"}>
              {technology.id === "quantum" ? "Discover Quantum" : "Discover AI"} <ArrowUpRight size={16} />
            </a> : <a className="underlined-link" href="#collaborate">
              Our partnerships <ArrowUpRight size={16} />
            </a>}
          </div>
          <div className="frontier-controls frontier-controls--minimal">
            <nav aria-label="Technology frontiers">
              {technologies.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActive(index)}
                  aria-pressed={active === index}
                  aria-label={`Show ${labels[index]}`}
                >
                  <span className="frontier-dot" aria-hidden="true" />
                </button>
              ))}
            </nav>
            {motionEnabled && (
              <button
                className="frontier-pause"
                aria-label={
                  paused
                    ? "Play frontier animation"
                    : "Pause frontier animation"
                }
                onClick={toggle}
              >
                {paused ? <Play size={15} /> : <Pause size={15} />}
              </button>
            )}
          </div>
        </div>
        </div>
        <PartnerLink />
      </Container>
    </section>
  );
}
