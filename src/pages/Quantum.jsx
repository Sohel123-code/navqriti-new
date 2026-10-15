import PartnerLink from "../components/ui/PartnerLink";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";
import { ArrowUpRight, Pause, Play, Plus } from "lucide-react";
import SceneBoundary from "../components/ui/SceneBoundary";
import useSceneReady from "../hooks/useSceneReady";
import "../quantum.css";

const QuantumLiquidHero = lazy(() => import("../components/hero/QuantumLiquidHero"));
const QuantumField = lazy(() => import("../three/scenes/QuantumField"));

function Reveal({ children, motionEnabled, className = "" }) {
  return <Motion.div className={className} initial={motionEnabled ? { opacity: 0, y: 24 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: .15 }} transition={{ duration: .65, ease: [.22, 1, .36, 1] }}>{children}</Motion.div>;
}

export default function Quantum({ motionEnabled, toggleMotion }) {
  const [mode, setMode] = useState(0);
  const [phase, setPhase] = useState(90);
  const fieldRef = useRef(null);
  const fieldReady = useSceneReady(fieldRef, 100);
  useEffect(() => {
    const title = document.title;
    const theme = document.querySelector('meta[name="theme-color"]');
    const description = document.querySelector('meta[name="description"]');
    const oldDescription = description?.content;
    const oldTheme = theme?.content;
    document.title = "NavQriti Quantum — A new field of possibility";
    theme?.setAttribute("content", "#050505");
    description?.setAttribute("content", "Quantum Centers of Excellence, accessible campus GPU infrastructure and equity-free research support. Explore NavQriti Quantum.");
    return () => { document.title = title; if (oldDescription) description.content = oldDescription; if (oldTheme) theme.content = oldTheme; };
  }, []);
  return <div className={`quantum-page ${motionEnabled ? "" : "quantum-still"}`}>
    <main id="quantum-main">
      <section className="quantum-hero" aria-labelledby="quantum-title">
        <SceneBoundary><Suspense fallback={null}><QuantumLiquidHero motionEnabled={motionEnabled} /></Suspense></SceneBoundary>
        <div className="quantum-hero-shade" />
        <div className="quantum-hero-top quantum-wrap"><span>NAVQRITI / QUANTUM</span><span>RESEARCH WITHOUT BARRIERS</span></div>
        <Reveal className="quantum-hero-copy quantum-wrap" motionEnabled={motionEnabled}>
          <p className="quantum-eyebrow">THE NEXT FRONTIER IS OPEN.</p>
          <h1 id="quantum-title">A new field<br />of <em>possibility.</em></h1>
          <div className="quantum-hero-bottom"><p>Quantum thinking. Shared infrastructure.<br />From campus curiosity to real-world impact.</p><PartnerLink dark /></div>
        </Reveal>
        <div className="quantum-hero-foot quantum-wrap"><span>EDUCATION ↔ RESEARCH ↔ INNOVATION</span><button onClick={toggleMotion} aria-label={motionEnabled ? "Pause page animations" : "Play page animations"}>{motionEnabled ? <Pause size={13} /> : <Play size={13} />}{motionEnabled ? "PAUSE MOTION" : "PLAY MOTION"}</button></div>
      </section>

      <section className="quantum-lab quantum-wrap" id="quantum-lab" aria-labelledby="quantum-lab-title" ref={fieldRef}>
        <Reveal motionEnabled={motionEnabled} className="quantum-section-top"><p className="quantum-eyebrow">01 / THE EXPLORATION</p><h2 id="quantum-lab-title">Less abstract.<br /><span>More interactive.</span></h2><p>Explore a field of possibilities.<br />Change the phase. See the pattern shift.</p></Reveal>
        <div className="quantum-lab-stage">
          <div className="quantum-lab-label"><span><i /> LIVE EXPLORATION</span><span>{mode === 0 ? "01 / INTERFERENCE" : "02 / ORBITAL"}</span></div>
          <div className="quantum-field-fallback" aria-hidden="true"><i /><i /><i /></div>
          {fieldReady && <SceneBoundary><Suspense fallback={null}><QuantumField motionEnabled={motionEnabled} mode={mode} phase={phase} /></Suspense></SceneBoundary>}
          <div className="quantum-field-caption"><span>{mode === 0 ? "Two waves. One evolving field." : "A cloud of possibility."}</span><small>Illustrative visualization, not a quantum simulation.</small></div>
        </div>
        <div className="quantum-lab-controls">
          <div className="quantum-modes" aria-label="Particle structure">{["Interference", "Orbital cloud"].map((label, index) => <button key={label} aria-pressed={mode === index} onClick={() => setMode(index)}>{label}<Plus size={14} /></button>)}</div>
          <label className="quantum-phase"><span>PHASE <output>{phase}°</output></span><input aria-label="Field phase" type="range" min="0" max="180" value={phase} onChange={event => setPhase(Number(event.target.value))} /></label>
        </div>
        <PartnerLink dark />
      </section>

      <section id="quantum-campus" className="quantum-campus quantum-wrap" aria-labelledby="quantum-campus-title">
        <Reveal motionEnabled={motionEnabled} className="quantum-campus-heading"><p className="quantum-eyebrow">02 / BUILT AROUND YOUR CAMPUS</p><h2 id="quantum-campus-title">Big infrastructure.<br /><span>Open access.</span></h2></Reveal>
        <div className="quantum-campus-grid">
          <Reveal motionEnabled={motionEnabled} className="quantum-access"><p className="quantum-eyebrow">ON-CAMPUS GPU ACCESS</p><p className="quantum-price"><span>₹</span>50–60<small>/ hour</small></p><p>Investor-backed GPU infrastructure.<br />Within reach of students and faculty.</p><div className="quantum-compute" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} style={{ "--cell": i }} />)}</div></Reveal>
          <div className="quantum-campus-notes"><Reveal motionEnabled={motionEnabled}><span className="quantum-eyebrow">A PLACE TO EXPLORE</span><h3>Quantum Centers<br />of Excellence.</h3><p>Dedicated institutional spaces for research, experimentation and innovation.</p></Reveal><Reveal motionEnabled={motionEnabled}><span className="quantum-eyebrow">YOUR IDEAS STAY YOURS</span><h3>Research support.<br /><em>Zero equity taken.</em></h3><p>Open infrastructure and guidance for student and faculty projects.</p></Reveal></div>
        </div>
        <PartnerLink dark />
      </section>

      <section className="quantum-path quantum-wrap" aria-labelledby="quantum-path-title">
        <Reveal motionEnabled={motionEnabled}><p className="quantum-eyebrow">03 / FROM FIRST SPARK TO WHAT’S NEXT</p><div className="quantum-path-heading"><h2 id="quantum-path-title">Start curious.<br /><span>Go further.</span></h2></div></Reveal>
        <div className="quantum-steps"><Reveal motionEnabled={motionEnabled}><span>01 — IGNITE</span><h3>Bring quantum<br />to the classroom.</h3><p>Foundations and hands-on workshops for school and intermediate students.</p></Reveal><Reveal motionEnabled={motionEnabled}><span>02 — EXPERIMENT</span><h3>Give research<br />room to grow.</h3><p>Connect institutional centers, shared compute and collaborative support.</p></Reveal><Reveal motionEnabled={motionEnabled}><span>03 — LAUNCH</span><h3>Move ideas<br />into the world.</h3><p>Go-to-market strategies connecting campus innovation with industry.</p></Reveal></div>
        <PartnerLink dark />
      </section>
    </main>
    <footer className="quantum-footer quantum-wrap"><span>NAVQRITI / QUANTUM TECHNOLOGIES</span><a href="/ai">Explore artificial intelligence <ArrowUpRight size={16} /></a></footer>
  </div>;
}
