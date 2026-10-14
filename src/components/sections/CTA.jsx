import { ArrowUpRight } from "lucide-react";
import Container from "../ui/Container";

export default function CTA({ onContact }) {
  return (
    <section id="contact" className="cta" data-scroll-scene>
      <Container>
        <div className="cta-top" data-reveal>
          <p className="eyebrow">
            <span className="status-dot" /> LET’S BUILD WHAT’S NEXT
          </p>
          <span className="mono">DISCOVER. CREATE. DEPLOY.</span>
        </div>
        <button className="cta-link" onClick={onContact} data-reveal>
          <span data-parallax="title">
            What’s <span className="cta-serif">next?</span>
          </span>
          <span className="cta-arrow" data-parallax="counter">
            <ArrowUpRight strokeWidth={1} />
          </span>
        </button>
        <div className="cta-bottom" data-reveal>
          <p>Your next idea starts here.</p>
          <button className="underlined-link" onClick={onContact}>
            Start a conversation <ArrowUpRight size={18} />
          </button>
        </div>
      </Container>
    </section>
  );
}
