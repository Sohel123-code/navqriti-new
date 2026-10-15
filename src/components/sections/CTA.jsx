import PartnerLink from "../ui/PartnerLink";
import Container from "../ui/Container";

export default function CTA() {
  return (
    <section id="contact" className="cta cta--compact" data-scroll-scene>
      <Container>
        <div className="cta-top" data-reveal>
          <p className="eyebrow">
            <span className="status-dot" /> LET’S BUILD WHAT’S NEXT
          </p>
        </div>
        <div className="cta-compact-main" data-reveal>
          <div><h2>What’s <span className="cta-serif">next?</span></h2><p>Your next idea starts here.</p></div>
          <PartnerLink dark />
        </div>
      </Container>
    </section>
  );
}
