// Adapted from the user-supplied Framer VideoCarousel:
// https://framer.com/m/VideoCarousel-3ACghD.js@gN3OxtTWepzM2Kd4SUcE
// Retains shortest-path depth stacking, 18-degree perspective, blur/scale,
// swipe + keyboard + dot/arrow navigation and active-only native video playback.
import { useEffect, useRef, useState } from "react";
import { motion as Motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

function Film({ item, playing }) {
  const ref = useRef(null);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let cancelled = false;
    if (playing) {
      video.play().then(() => { if (!cancelled) setBlocked(false); }).catch((error) => {
        if (!cancelled && error.name !== "AbortError") setBlocked(true);
      });
    } else video.pause();
    return () => { cancelled = true; video.pause(); };
  }, [playing]);
  return (
    <>
      {failed ? <img className="purpose-film" src={item.poster} alt="" /> :
        <video className="purpose-film" ref={ref} src={item.video} poster={item.poster} muted playsInline loop preload="none" aria-hidden="true" onError={() => setFailed(true)} />}
      {playing && blocked && !failed && <button className="purpose-retry" onClick={() => ref.current?.play().then(() => setBlocked(false)).catch(() => {})} aria-label="Play visual"><Play size={15} /> Play visual</button>}
    </>
  );
}

export default function VideoCarousel({ items, motionEnabled }) {
  const ref = useRef(null);
  const drag = useRef(null);
  const lastWheel = useRef(0);
  const inView = useInView(ref, { amount: .3 });
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const running = motionEnabled && !paused && inView && pageVisible;
  const count = items.length;
  const goTo = (index) => setActive((index + count) % count);
  useEffect(() => {
    const change = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  useEffect(() => {
    if (!running || dragging) return;
    const timer = setTimeout(() => setActive((value) => (value + 1) % count), 3000);
    return () => clearTimeout(timer);
  }, [running, dragging, active, count]);
  const release = (event) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    if (Math.abs(dx) > 32 && Math.abs(dx) > Math.abs(dy)) goTo(active + (dx < 0 ? 1 : -1));
    drag.current = null;
    setDragging(false);
  };
  return (
    <div className="purpose-carousel" ref={ref} role="region" aria-roledescription="carousel" aria-label="NavQriti vision and mission" tabIndex={0}
      onKeyDown={(event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        goTo(event.key === "Home" ? 0 : event.key === "End" ? count - 1 : active + (event.key === "ArrowRight" ? 1 : -1));
      }}>
      <div className="purpose-stage"
        onPointerDown={(event) => {
          if (event.target.closest("button") || event.button !== 0 || !event.isPrimary) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          drag.current = { x: event.clientX, y: event.clientY };
          setDragging(true);
        }}
        onPointerUp={release} onPointerCancel={() => { drag.current = null; setDragging(false); }}
        onLostPointerCapture={() => { drag.current = null; setDragging(false); }}
        onWheel={(event) => {
          if (Math.abs(event.deltaX) < Math.max(24, Math.abs(event.deltaY)) || performance.now() - lastWheel.current < 600) return;
          lastWheel.current = performance.now(); goTo(active + (event.deltaX > 0 ? 1 : -1));
        }}>
        {items.map((item, index) => {
          let relative = index - active;
          if (relative > Math.floor(count / 2)) relative -= count;
          if (relative < -Math.floor(count / 2)) relative += count;
          const current = index === active;
          const transform = `translateX(calc(var(--purpose-spacing) * ${relative})) translateZ(${-Math.abs(relative) * 91}px) rotateY(${relative * -18}deg) scale(${current ? 1 : .92})`;
          return <Motion.article className="purpose-card" key={item.id} aria-hidden={!current} inert={!current} aria-roledescription="slide" aria-label={`${index + 1} of ${count}: ${item.navigation}`}
            style={{ zIndex: count - Math.abs(relative), pointerEvents: current ? "auto" : "none" }} initial={false}
            animate={{ transform, opacity: current ? 1 : .56, filter: `blur(${current ? 0 : 3}px)` }}
            transition={motionEnabled ? { type: "spring", stiffness: 260, damping: 34 } : { duration: 0 }}>
            <Film item={item} playing={running && current} />
            <div className="purpose-film-shade" />
            <div className="purpose-card-copy">
              <span className="mono">{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </Motion.article>;
        })}
      </div>
      <div className="purpose-controls">
        <button className="purpose-arrow" aria-label="Previous purpose slide" onClick={() => goTo(active - 1)}><ArrowLeft size={18} /></button>
        <nav className="purpose-dots" aria-label="Vision and mission slides">
          {items.map((item, index) => <button key={item.id} onClick={() => goTo(index)} aria-label={item.navigation} aria-current={active === index ? "true" : undefined}><i /><span>{item.navigation}</span></button>)}
        </nav>
        <button className="purpose-arrow" aria-label="Next purpose slide" onClick={() => goTo(active + 1)}><ArrowRight size={18} /></button>
        {motionEnabled && <button className="purpose-arrow purpose-pause" aria-label={paused ? "Play purpose carousel" : "Pause purpose carousel"} onClick={() => setPaused((value) => !value)}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>}
      </div>
    </div>
  );
}
