import { ArrowUpRight, ArrowUp } from "lucide-react";
import Container from "../ui/Container";
import { navigation } from "../../data/navigation";
import { useLayoutEffect, useRef } from "react";
import { createScrollReveals } from "../../animations/gsap/scroll";

export default function Footer({ onContact, motionEnabled }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!motionEnabled) return;
    const animation = createScrollReveals(ref.current);
    return () => animation.revert();
  }, [motionEnabled]);
  return (
    <footer className="footer" ref={ref} data-scroll-scene>
      <Container>
        <div className="footer-main" data-reveal data-parallax="subtle">
          <div>
            <a href="#home" className="wordmark" aria-label="NavQriti home">
              NavQriti<span>↗</span>
            </a>
            <p>
              A unit of Nyeras Edu-Tech and
              <br />
              Innovations Private Limited.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            {navigation.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
            <button onClick={onContact}>
              Connect with us <ArrowUpRight size={15} />
            </button>
          </nav>
          <a href="#home" className="back-top" aria-label="Back to top">
            <ArrowUp size={21} />
          </a>
        </div>
        <div className="footer-bottom" data-reveal>
          <span>
            © {new Date().getFullYear()} NavQriti. All rights reserved.
          </span>
          <span className="mono">
            RESEARCH / TECHNOLOGY / INNOVATION / IMPACT
          </span>
        </div>
      </Container>
    </footer>
  );
}
