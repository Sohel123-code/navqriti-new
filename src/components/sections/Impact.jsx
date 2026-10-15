import { useRef } from "react";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import ImageAccordion from "../ui/ImageAccordion";
import { researchStages } from "../../data/statistics";
import useMediaQuery from "../../hooks/useMediaQuery";
import useScrollSequence from "../../hooks/useScrollSequence";

export default function Impact({ motionEnabled }) {
  const ref = useRef(null);
  const desktop = useMediaQuery("(min-width: 901px) and (min-height: 650px)");
  const pinned = motionEnabled && desktop;
  const { active, select, playing, toggle } = useScrollSequence(ref, researchStages.length, pinned);
  return (
    <section id="approach" ref={ref} className={`impact-gallery ${pinned ? "is-scroll-chapter" : ""}`} data-scroll-scene aria-labelledby="approach-title">
      <div className="impact-gallery-sticky">
        <div className="impact-gallery-heading">
          <h2 id="approach-title">Discover. Create. <span>Deploy.</span></h2>
        </div>
        <ImageAccordion items={researchStages} active={active} onSelect={select} motionEnabled={motionEnabled} />
        <div className="impact-gallery-controls">
          <nav aria-label="Research to impact stages">
            {researchStages.map((stage, index) => <button key={stage.number} aria-label={stage.title} title={stage.title} aria-current={index === active ? "step" : undefined} onClick={() => select(index)}><span className="mono">{stage.number}</span></button>)}
          </nav>
          {pinned && <button className="impact-play" onClick={toggle} aria-label={playing ? "Pause stage film" : "Play stage film"}>{playing ? <Pause size={15} /> : <Play size={15} />}</button>}
        </div>
        <div className="impact-gallery-bottom mono">
          <span>{pinned ? <><ArrowDown size={13} /> SCROLL TO EXPLORE</> : "SELECT A STAGE"}</span>
          <a href="#collaborate" aria-label="Continue to collaboration" title="Continue to collaboration"><ArrowUpRight size={17} /></a>
        </div>
      </div>
    </section>
  );
}
