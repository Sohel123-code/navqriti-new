import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
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

import { loadAI, loadQuantum, normalizePath } from "./pages/pageLoaders";

const ArtificialIntelligence = lazy(loadAI);
const Quantum = lazy(loadQuantum);

export default function App() {
  const appRef = useRef(null);
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname));
  const isAIPage = /^\/ai\/?$/.test(pathname);
  const isQuantumPage = /^\/quantum\/?$/.test(pathname);
  const isContactPage = /^\/contact\/?$/.test(pathname);
  const isDetailPage = isAIPage || isQuantumPage;
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [motionPreference, setMotionPreference] = useState(null);
  const [contactOpen, setContactOpen] = useState(false);
  const navigate = useCallback(path => { setContactOpen(false); setPathname(path); }, []);
  const motionEnabled = motionPreference ?? !reducedMotion;
  useLenis(motionEnabled, pathname);
  useHashNavigation();
  useLayoutEffect(() => {
    if (motionEnabled && !isDetailPage && !isContactPage) return createCinematicScroll(appRef.current);
  }, [motionEnabled, isDetailPage, isContactPage]);
  useLayoutEffect(() => {
    document.documentElement.toggleAttribute("data-detail-page", pathname !== "/");
  }, [pathname]);
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", pathname === "/" ? "#f7f7f5" : "#050505");
    if (pathname === "/") document.title = "NavQriti \u2014 Creating What Comes Next.";
  }, [pathname]);
  const onContact = () => setContactOpen(true);
  return (
    <MotionConfig reducedMotion={motionEnabled ? "never" : "always"}>
      <div
        ref={appRef}
        className={`app ${isDetailPage || isContactPage ? "app--detail" : ""} ${motionEnabled ? "" : "motion-paused"}`}
      >
        <Navbar key={pathname} dark={isDetailPage || isContactPage} mainId={isAIPage ? "ai-main" : isQuantumPage ? "quantum-main" : "main"} />
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
      <RouteTransition motionEnabled={motionEnabled} onNavigate={navigate} />
    </MotionConfig>
  );
}
