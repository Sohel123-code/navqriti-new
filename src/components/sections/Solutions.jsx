import { useState } from "react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import SolutionCard from "../cards/SolutionCard";
import { solutions } from "../../data/solutions";

export default function Solutions({ onContact, motionEnabled }) {
  const [active, setActive] = useState("research");
  return (
    <section
      id="capabilities"
      className="solutions section-pad"
      data-scroll-scene
    >
      <Container>
        <div className="section-top" data-reveal>
          <SectionHeading number="05" light>
            WHAT WE DO
          </SectionHeading>
          <span className="mono subtle">DISCOVER. CREATE. DEPLOY.</span>
        </div>
        <div className="section-intro" data-reveal data-parallax="title">
          <h2>
            From the first question.
            <br />
            <span className="muted-light">To what comes next.</span>
          </h2>
          <p>Four capabilities. One connected approach.</p>
        </div>
        <div className="solutions-list" data-parallax="subtle">
          {solutions.map((solution) => (
            <SolutionCard
              key={solution.id}
              solution={solution}
              open={active === solution.id}
              onToggle={() =>
                setActive(active === solution.id ? null : solution.id)
              }
              onContact={onContact}
              motionEnabled={motionEnabled}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
