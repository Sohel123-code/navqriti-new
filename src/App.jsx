import { useLayoutEffect, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ContactForm from "./components/forms/ContactForm";
import Home from "./pages/Home";
import useMediaQuery from "./hooks/useMediaQuery";
import useLenis from "./hooks/useLenis";
import { createCinematicScroll } from "./animations/gsap/parallax";

export default function App() {
  const appRef = useRef(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [motionPreference, setMotionPreference] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const motionEnabled = motionPreference ?? !reducedMotion;
  useLenis(motionEnabled);
  useLayoutEffect(() => {
    if (motionEnabled) return createCinematicScroll(appRef.current);
  }, [motionEnabled]);
  const onContact = () => setContactOpen(true);
  return (
    <MotionConfig reducedMotion={motionEnabled ? "never" : "always"}>
      <div
        ref={appRef}
        className={`app ${motionEnabled ? "" : "motion-paused"}`}
      >
        <Navbar onContact={onContact} />
        <Home
          motionEnabled={motionEnabled}
          toggleMotion={() => setMotionPreference(!motionEnabled)}
          onContact={onContact}
        />
        <Footer onContact={onContact} motionEnabled={motionEnabled} />
        <ContactForm open={contactOpen} onClose={() => setContactOpen(false)} />
      </div>
    </MotionConfig>
  );
}
