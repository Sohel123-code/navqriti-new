import PartnerLink from "../ui/PartnerLink";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import VideoCarousel from "../ui/VideoCarousel";
import { purposeSlides } from "../../data/purpose";

export default function VisionMission({ motionEnabled }) {
  return (
    <section id="vision-mission" className="vision-mission section-pad" data-scroll-scene aria-labelledby="purpose-title">
      <Container>
        <div className="purpose-heading" data-reveal>
          <SectionHeading number="03" light>OUR PURPOSE</SectionHeading>
          <h2 id="purpose-title">Vision <span>&</span> mission.</h2>
        </div>
        <VideoCarousel items={purposeSlides} motionEnabled={motionEnabled} />
        <PartnerLink dark />
      </Container>
    </section>
  );
}
