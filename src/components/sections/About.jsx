import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import AnimatedText from "../ui/AnimatedText";
import NameStory from "./NameStory";

export default function About({ motionEnabled }) {
  return (
    <section id="about" className="about section-pad" data-scroll-scene>
      <Container>
        <div className="about-grid">
          <div data-reveal data-parallax="subtle">
            <SectionHeading number="01">THE NAVQRITI IDEA</SectionHeading>
          </div>
          <div data-parallax="title">
            <AnimatedText
              text="From curiosity to real-world impact."
              className="statement"
              motionEnabled={motionEnabled}
            />
            <div className="about-copy" data-reveal>
              <p>
                We bring research, engineering and entrepreneurship together to
                turn bold ideas into working solutions.
              </p>
            </div>

          </div>
        </div>
        <NameStory motionEnabled={motionEnabled} />
      </Container>
    </section>
  );
}
