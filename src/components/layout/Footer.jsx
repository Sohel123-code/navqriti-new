import ParticleText from "../ui/ParticleText";
import Container from "../ui/Container";

export default function Footer({ motionEnabled }) {
  return (
    <footer className="footer footer--signature-only" data-scroll-scene>
      <div className="footer-signature">
        <Container>
          <ParticleText motionEnabled={motionEnabled} />
        </Container>
      </div>
    </footer>
  );
}
