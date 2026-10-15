import { useEffect, useRef, useState } from "react";
import { motion as Motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import useMediaQuery from "../../hooks/useMediaQuery";
import useSceneReady from "../../hooks/useSceneReady";

const film = "/videos/company/navqriti-company-film.mp4";

export default function QuantumFilm({ motionEnabled }) {
  const section = useRef(null);
  const video = useRef(null);
  const ready = useSceneReady(section, 0);
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const compact = useMediaQuery("(max-width: 767px)");
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, .35, .65, 1], [compact ? 24 : 80, 0, 0, compact ? -12 : -48]);
  const scale = useTransform(scrollYProgress, [0, .35, .65, 1], [.96, 1, 1, .98]);
  const borderRadius = useTransform(scrollYProgress, [0, .35, .65, 1], [8, 8, compact ? 18 : 34, compact ? 22 : 42]);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 150, damping: 25 });
  const buttonY = useSpring(pointerY, { stiffness: 150, damping: 25 });

  useEffect(() => {
    const element = video.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) element.pause();
    }, { threshold: .05 });
    const visibility = () => { if (document.hidden) element.pause(); };
    observer.observe(element);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      element.pause();
    };
  }, []);

  useEffect(() => {
    if (!motionEnabled) video.current?.pause();
  }, [motionEnabled]);

  const resetPointer = () => { pointerX.set(0); pointerY.set(0); };
  const follow = event => {
    if (!finePointer || !motionEnabled || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    // Keep the pill inside the frame, with a stable position for touch/keyboard.
    pointerX.set(Math.max(-box.width * .32, Math.min(box.width * .32, event.clientX - box.left - box.width / 2)));
    pointerY.set(Math.max(-box.height * .24, Math.min(box.height * .24, event.clientY - box.top - box.height * .65)));
  };
  const play = () => {
    const element = video.current;
    if (!element.getAttribute("src")) element.src = film;
    element.play().catch(() => { /* Keep the play button available if playback is blocked. */ });
  };

  return <section ref={section} className={`quantum-film ${motionEnabled ? "quantum-film--animated" : ""}`} id="quantum-film" aria-labelledby="quantum-film-title">
    <div className="quantum-film-heading quantum-wrap">
      <h2 id="quantum-film-title">The thinking behind <span>what comes next.</span></h2>
      <p className="quantum-eyebrow">THE NAVQRITI FILM / 48 SECONDS</p>
    </div>
    <div className="quantum-film-scroll">
      <Motion.div className="quantum-film-frame" style={motionEnabled ? { y, scale, borderRadius } : undefined}>
        <video ref={video} src={ready ? film : undefined} poster="/videos/company/navqriti-company-film-poster.jpg" preload="none" playsInline muted controls={started} onPlay={() => setStarted(true)} onError={() => setFailed(true)} aria-label="NavQriti: vision, mission, technology focus and values" />
        {!started && !failed && <div className="quantum-film-intro" onPointerMove={follow} onPointerLeave={resetPointer}>
          <div className="quantum-film-orbits" aria-hidden="true"><i /><i /><i />{Array.from({ length: 48 }, (_, i) => <span key={i} style={{ "--dot": i }} />)}</div>
          <span className="quantum-film-wordmark" aria-hidden="true">NavQriti</span>
          <Motion.button className="quantum-film-play" style={finePointer && motionEnabled ? { x, y: buttonY } : undefined} onClick={play} onFocus={event => { if (event.currentTarget.matches(":focus-visible")) resetPointer(); }} aria-label="Play NavQriti company film"><Play size={15} fill="currentColor" /> Play intro</Motion.button>
        </div>}
        {failed && <div className="quantum-film-error"><p>The film couldn’t load.</p><a href={film}>Open the video directly</a></div>}
      </Motion.div>
    </div>
    <details className="quantum-film-transcript quantum-wrap">
      <summary>Read the film transcript</summary>
      <p>NavQriti is a research, technology and innovation organisation, turning new knowledge into deployable solutions.</p>
      <p>Our vision: advance frontier technologies and create meaningful progress for society. Our mission: integrate research, engineering and innovation to solve real-world problems and create measurable value.</p>
      <p>Our frontiers include Artificial Intelligence, Quantum Technologies, Advanced Computing and Intelligent Systems. Our research-to-impact journey: Discover, Research, Develop, Validate, Deploy and Scale.</p>
      <p>Integrity, scientific excellence, collaboration and responsible technology guide us. Science, academia and entrepreneurship form one connected ecosystem. NavQriti is a unit of Nyeras Edu-Tech and Innovations Private Limited.</p>
    </details>
  </section>;
}
