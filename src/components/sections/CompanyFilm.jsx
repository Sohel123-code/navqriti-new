import { useEffect, useRef, useState } from "react";
import { motion as Motion, useScroll, useTransform } from "framer-motion";
import { Pause, Play } from "lucide-react";
import useMediaQuery from "../../hooks/useMediaQuery";
import useSceneReady from "../../hooks/useSceneReady";
import "../../company-film.css";

const film = "/videos/company/navqriti-company-film.mp4";

export default function CompanyFilm({ motionEnabled }) {
  const section = useRef(null);
  const scrollFrame = useRef(null);
  const video = useRef(null);
  const ready = useSceneReady(section, 0);
  const compact = useMediaQuery("(max-width: 767px)");
  const [playing, setPlaying] = useState(false);
  const [playbackPreference, setPlaybackPreference] = useState(null);
  const [failed, setFailed] = useState(false);
  // Measure the untransformed wrapper so growing the film never feeds back into
  // its scroll position. The reference expands on entry and reverses on return.
  const { scrollYProgress } = useScroll({ target: scrollFrame, offset: ["start 0.9", "start 0.22"] });
  const scale = useTransform(scrollYProgress, (progress) => {
    const start = compact ? .76 : .56;
    const eased = progress * progress * (3 - 2 * progress);
    return start + (1 - start) * eased;
  });
  const borderRadius = useTransform(scale, (value) => `${(compact ? 18 : 32) / value}px`);
  // Keep the only control at a usable 48px, including the smaller entrance state.
  const controlScale = useTransform(scale, (value) => 1 / value);
  useEffect(() => {
    if (!ready) return;
    const element = video.current;
    let visible = false;
    const sync = () => {
      element.defaultPlaybackRate = 2;
      element.playbackRate = 2;
      if (visible && !document.hidden && (playbackPreference ?? motionEnabled)) {
        element.play().catch(() => { /* The same corner button retries blocked autoplay. */ });
      } else element.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: .05 });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    element.addEventListener("loadedmetadata", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      element.removeEventListener("loadedmetadata", sync);
      element.pause();
    };
  }, [ready, motionEnabled, playbackPreference]);

  const togglePlayback = () => {
    const element = video.current;
    if (!element.paused) {
      setPlaybackPreference(false);
      element.pause();
    } else {
      setPlaybackPreference(true);
      if (!element.getAttribute("src")) element.src = film;
      element.defaultPlaybackRate = 2;
      element.playbackRate = 2;
      element.play().catch(() => {});
    }
  };

  return <section ref={section} className={`quantum-film ${motionEnabled ? "quantum-film--animated" : ""}`} id="vision-mission" aria-labelledby="quantum-film-title">
    <div className="quantum-film-heading quantum-wrap">
      <h2 id="quantum-film-title">The thinking behind <span>what comes next.</span></h2>
      <p className="quantum-eyebrow">THE NAVQRITI FILM</p>
    </div>
    <div ref={scrollFrame} className="quantum-film-scroll">
      <Motion.div className="quantum-film-frame" style={motionEnabled ? { scale, borderRadius } : undefined}>
        <video ref={video} src={ready ? film : undefined} poster="/videos/company/navqriti-company-film-poster.jpg" preload="none" playsInline muted loop disablePictureInPicture controls={false} onPlay={() => { video.current.playbackRate = 2; setPlaying(true); }} onPause={() => setPlaying(false)} onError={() => setFailed(true)} aria-label="NavQriti: vision, mission, technology focus and values" />
        {!failed && <Motion.button className="quantum-film-toggle" style={motionEnabled ? { scale: controlScale } : undefined} onClick={togglePlayback} aria-label={playing ? "Pause company film" : "Play company film"} title={playing ? "Pause" : "Play"}>
          {playing ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
        </Motion.button>}
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
