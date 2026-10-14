import { ArrowDown } from "lucide-react";
import MagneticButton from "../ui/MagneticButton";
import AnimatedText from "../ui/AnimatedText";

export default function HeroText({ motionEnabled, onContact }) {
  return (
    <div className="hero-copy" data-parallax="title">
      <div className="eyebrow hero-eyebrow" data-hero-fade>
        <span className="status-dot" /> AT THE INTERSECTION OF WHAT’S NEXT
      </div>
      <h1 aria-label="Creating what comes next.">
        <span className="hero-line">
          <span data-hero-line>Creating</span>
        </span>
        <span className="hero-line">
          <span data-hero-line>what comes</span>
        </span>
        <span className="hero-line">
          <span data-hero-line className="last-line">
            <AnimatedText
              as="span"
              decorative
              text="next."
              className="hero-typewriter"
              motionEnabled={motionEnabled}
            />
          </span>
        </span>
      </h1>
      <p className="hero-description" data-hero-fade>
        Research. Technology. Real-world impact.
      </p>
      <div className="hero-actions" data-hero-fade>
        <MagneticButton onClick={onContact} motionEnabled={motionEnabled}>
          Build what’s next
        </MagneticButton>
        <a className="text-link" href="#capabilities">
          Explore our capabilities <ArrowDown size={16} />
        </a>
      </div>
    </div>
  );
}
