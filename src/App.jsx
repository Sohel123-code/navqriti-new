import { lazy, Suspense, useLayoutEffect, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ContactForm from "./components/forms/ContactForm";
import CursorDotTrail from "./components/ui/CursorDotTrail";
import Contact from "./pages/Contact";
import "./navigation.css";
import RouteTransition from "./components/layout/RouteTransition";
import Home from "./pages/Home";
import useMediaQuery from "./hooks/useMediaQuery";
import useLenis from "./hooks/useLenis";
import useHashNavigation from "./hooks/useHashNavigation";
import { createCinematicScroll } from "./animations/gsap/parallax";
import "./page-transitions.css";

const ArtificialIntelligence = lazy(() => import("./pages/ArtificialIntelligence"));
const Quantum = lazy(() => import("./pages/Quantum"));

export default function App() {
  const appRef = useRef(null);
  const isAIPage = /^\/ai\/?$/.test(window.location.pathname);
  const isQuantumPage = /^\/quantum\/?$/.test(window.location.pathname);
  const isContactPage = /^\/contact\/?$/.test(window.location.pathname);
  const isDetailPage = isAIPage || isQuantumPage;
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [motionPreference, setMotionPreference] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const motionEnabled = motionPreference ?? !reducedMotion;
  useLenis(motionEnabled);
  useHashNavigation();
  useLayoutEffect(() => {
    if (motionEnabled && !isDetailPage && !isContactPage) return createCinematicScroll(appRef.current);
  }, [motionEnabled, isDetailPage, isContactPage]);
  const onContact = () => setContactOpen(true);
  return (
    <MotionConfig reducedMotion={motionEnabled ? "never" : "always"}>
      <div
        ref={appRef}
        className={`app ${isDetailPage || isContactPage ? "app--detail" : ""} ${motionEnabled ? "" : "motion-paused"}`}
      >
        <Navbar dark={isDetailPage || isContactPage} mainId={isAIPage ? "ai-main" : isQuantumPage ? "quantum-main" : "main"} />
        {isContactPage ? <div className="detail-entrance"><Contact onContact={onContact} /></div> : isDetailPage ? <Suspense fallback={<div className="detail-loading" role="status" aria-label="Loading page"><span aria-hidden="true" /></div>}><div className="detail-entrance">{isQuantumPage ? <Quantum motionEnabled={motionEnabled} toggleMotion={() => setMotionPreference(!motionEnabled)} /> : <ArtificialIntelligence motionEnabled={motionEnabled} toggleMotion={() => setMotionPreference(!motionEnabled)} />}</div></Suspense> : <>
        <Home
          motionEnabled={motionEnabled}
          toggleMotion={() => setMotionPreference(!motionEnabled)}
        />
        <Footer motionEnabled={motionEnabled} />
        </>}
        {isContactPage && <ContactForm dark open={contactOpen} onClose={() => setContactOpen(false)} motionEnabled={motionEnabled} />}
      </div>
      <CursorDotTrail motionEnabled={motionEnabled && isDetailPage && !contactOpen} />
      <RouteTransition motionEnabled={motionEnabled} />
    </MotionConfig>
  );
}
