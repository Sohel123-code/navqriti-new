import { ArrowUpRight } from "lucide-react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { stakeholders } from "../../data/industries";

export default function Industries({ onContact }) {
  return (
    <section
      id="collaborate"
      className="industries section-pad"
      data-scroll-scene
    >
      <Container className="industries-grid">
        <div data-reveal data-parallax="title">
          <SectionHeading number="04">PROGRESS IS COLLABORATIVE</SectionHeading>
          <h2>
            Different perspectives.
            <br />
            <span className="muted">Shared possibilities.</span>
          </h2>
          <p>Science, academia and enterprise. Moving forward together.</p>
        </div>
        <div className="stakeholder-list" data-reveal>
          {stakeholders.map((name, i) => (
            <button
              key={name}
              onClick={onContact}
              data-parallax="row"
              style={{ "--parallax-depth": 12 + i * 9 }}
            >
              <span className="mono">0{i + 1}</span>
              {name}
              <ArrowUpRight size={22} />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
