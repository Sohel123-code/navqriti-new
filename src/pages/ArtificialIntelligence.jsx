import PartnerLink from "../components/ui/PartnerLink";
import { lazy, Suspense, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Check, Code2, Cpu, GraduationCap, Pause, Play, Sparkles } from "lucide-react";
import AIParticleHero from "../components/hero/AIParticleHero";
import AIDashboard from "../components/ui/AIDashboard";
import SceneBoundary from "../components/ui/SceneBoundary";
import "../ai.css";

const LiquidImage = lazy(() => import("../components/ui/LiquidImage"));
const closingAlt = "Two figures supporting each other across a particle landscape";
function ClosingImage() {
  return <img className="ai-liquid-fallback" src="/images/ai/closing.png" alt={closingAlt} loading="lazy" />;
}

function Reveal({ children, className = "", motionEnabled }) {
  return <Motion.div className={className} initial={motionEnabled ? { opacity: 0, y: 20 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ amount: .12, once: false }} transition={{ duration: .45, ease: [.22, 1, .36, 1] }}>{children}</Motion.div>;
}
function Heading({ number, label, title, children }) {
  return <div className="ai-heading"><p className="ai-kicker">//{number} — {label}</p><h2>{title}</h2>{children && <p className="ai-description">{children}</p>}</div>;
}
function Actions() {
  return <div className="ai-actions"><PartnerLink dark /><a className="ai-pill" href="#ai-product">Preview the workspace</a></div>;
}
function WorkflowGraphic({ stage }) {
  return <div className="ai-workflow-art" style={{ backgroundImage: `url(/images/ai/workflow-${stage === 1 ? "two" : "one"}.png)` }} aria-label="Illustrative learning workflow">
    <div className="ai-terminal">
      <span className="ai-mini">{["ACCESS / RESEARCH SUPPORT", "CODE / LOGICAL GUIDANCE", "NEXTMO / ASSESSMENT"][stage]}</span>
      {stage === 0 ? <><p>▸ Opening possibilities…</p>{["Claude", "GPT", "Research support"].map(s => <div className="ai-terminal-row" key={s}><Check size={13} /><span>{s}</span><small>ACCESS</small></div>)}<p className="ai-terminal-note">Tools + guidance. One learning journey.</p></> : stage === 1 ? <><div className="ai-signal" aria-hidden="true"><svg viewBox="0 0 260 80"><path className="ai-grid-line" d="M0 20H260M0 40H260M0 60H260"/><path className="ai-signal-line" d="M0 61L18 56 35 59 53 50 66 55 79 19 92 50 114 46 131 40 145 44 163 34 175 12 190 42 211 37 230 30 248 34 260 27"/></svg></div><strong>Diagnose. Brainstorm. Understand.</strong><p>Spot errors and reason through the next step.</p></> : <><span className="ai-status-label">GUIDED EVALUATION</span><p>→ Student assessments</p><p>→ Candidate monitoring</p><p>→ AI-driven interviews</p><div className="ai-terminal-row"><Check size={14} /> Demonstrate your understanding</div></>}
    </div>
  </div>;
}

export default function ArtificialIntelligence({ motionEnabled, toggleMotion }) {
  useEffect(() => {
    document.title = "NavQriti AI — From Access to Understanding";
    const theme = document.querySelector('meta[name="theme-color"]');
    const description = document.querySelector('meta[name="description"]');
    const previous = description?.content;
    theme?.setAttribute("content", "#000000");
    description?.setAttribute("content", "Explore NavQriti’s AI tools and research support, agentic LMS, Nextmo assessments and guided AI literacy. Build with AI. Understand what you create.");
    return () => { theme?.setAttribute("content", "#f7f7f5"); if (previous) description?.setAttribute("content", previous); };
  }, []);
  return <div className={`ai-page ${motionEnabled ? "" : "ai-still"}`}>
    <main id="ai-main">
      <section className="ai-hero" id="ai-top">
        <AIParticleHero motionEnabled={motionEnabled} />
        <div className="ai-wrap ai-hero-content">
          <Reveal motionEnabled={motionEnabled}><p className="ai-kicker">// AI ACCESS. HUMAN UNDERSTANDING.</p><h1>TURNING<br />ACCESS INTO<br />ABILITY</h1></Reveal>
          <Reveal className="ai-hero-side" motionEnabled={motionEnabled}><p>Accessible AI. Guided learning.<br />Real understanding.</p><Actions /></Reveal>
        </div>
        <button className="ai-motion-control" onClick={toggleMotion} aria-label={motionEnabled ? "Pause page animations" : "Play page animations"}>{motionEnabled ? <Pause size={13} /> : <Play size={13} />}<span>{motionEnabled ? "PAUSE MOTION" : "PLAY MOTION"}</span></button>
      </section>

      <section className="ai-section ai-wrap" id="ai-challenge">
        <Reveal motionEnabled={motionEnabled}><Heading number="02" label="THE CHALLENGE" title={<>AI IS EVERYWHERE.<br />ACCESS IS NOT.</>}>Bridge the guidance gap. Understand what you build.</Heading></Reveal>
        <div className="ai-challenges">{[["barrier-access.jpg", "Disconnected AI tools", Cpu], ["barrier-guidance.jpg", "Disconnected guidance", Sparkles], ["barrier-understanding.jpg", "Answers without understanding", GraduationCap]].map(([img, text, Icon]) => <Reveal key={text} motionEnabled={motionEnabled}><img src={`/images/ai/${img}`} alt="" loading="lazy" /><h3><span><Icon size={19} /></span>{text}</h3></Reveal>)}</div>
        <PartnerLink dark />
      </section>

      <section className="ai-section ai-wrap" id="ai-product">
        <Reveal motionEnabled={motionEnabled}><Heading number="03" label="THE PLATFORM" title={<>BUILD WITH AI.<br />UNDERSTAND MORE.</>}>Code guidance, assessments and AI literacy in one connected learning journey.</Heading></Reveal>
        <Reveal motionEnabled={motionEnabled} className="ai-dashboard-frame"><AIDashboard /></Reveal>
        
        <PartnerLink dark />
      </section>

      <section className="ai-section ai-wrap ai-solution">
        <Reveal motionEnabled={motionEnabled}><p className="ai-kicker">//04 — THE SOLUTION</p><h2>ONE ECOSYSTEM.<br />REAL ABILITY.</h2><p className="ai-description">AI tools, agentic guidance and practical learning. From first access to confident execution.</p><a className="ai-secondary-link" href="#ai-workflow">How it works</a></Reveal>
        <Reveal motionEnabled={motionEnabled} className="ai-solution-art"><img src="/images/ai/solution.jpg" alt="" loading="lazy" /><div>{["Claude & GPT access", "Agentic AI inside the LMS", "Nextmo-powered evaluation", "Guided AI literacy"].map(t => <span key={t}><i />{t}</span>)}</div></Reveal>
        <PartnerLink dark />
      </section>

      <section className="ai-section ai-wrap" id="ai-workflow">
        <Reveal motionEnabled={motionEnabled}><Heading number="05" label="HOW IT WORKS" title={<>FROM ACCESS TO<br />EXECUTION.</>}>Three steps. Access, build, demonstrate.</Heading></Reveal>
        <div className="ai-workflow">{[
          ["01—ACCESS", "OPEN THE DOOR.", "Claude and GPT access, with ongoing research support from Naira Navakriti."],
          ["02—BUILD", "THINK THROUGH IT.", "Embedded agentic AI scans code, diagnoses errors and guides logical problem-solving."],
          ["03—DEMONSTRATE", "SHOW WHAT YOU KNOW.", "Nextmo supports assessments, monitoring and interviews. The Navriti / Navocriti framework keeps logic, execution and code understanding at the core."]
        ].map(([label, title, text], i) => <article className="ai-workflow-card" style={{ "--step": i }} key={label}><div><p className="ai-kicker">{label}</p><h2>{title}</h2><p className="ai-description">{text}</p></div><WorkflowGraphic stage={i} /></article>)}</div>
        <PartnerLink dark />
      </section>

      <section className="ai-section ai-wrap ai-tools">
        
        <div className="ai-tool-window"><div className="ai-tool-track">{[0, 1].map(copy => <div className="ai-tool-set" key={copy} aria-hidden={copy === 1}>{["Claude", "GPT", "Nextmo", "Agentic LMS", "Naira Navakriti"].map((t, i) => <span key={t}><span className="ai-tool-icon">{[<Sparkles key="s" />, <Cpu key="c" />, <GraduationCap key="g" />, <Code2 key="d" />, <ArrowUpRight key="a" />][i]}</span>{t}</span>)}</div>)}</div></div>
        <PartnerLink dark />
      </section>

      <section className="ai-closing ai-closing-compact">
        <div className="ai-closing-image">
          <SceneBoundary fallback={<ClosingImage />}>
            <Suspense fallback={<ClosingImage />}>
              <LiquidImage src="/images/ai/closing.png" alt={closingAlt} motionEnabled={motionEnabled} contain reveal={false} />
            </Suspense>
          </SceneBoundary>
        </div>
        <Reveal motionEnabled={motionEnabled}><h2>BUILD WITH AI.<br />OWN THE UNDERSTANDING.</h2><PartnerLink dark /></Reveal>
      </section>
    </main>
    <footer className="ai-return ai-wrap"><span className="ai-kicker">NAVQRITI / ARTIFICIAL INTELLIGENCE</span><a className="ai-top-link" href="#ai-top" aria-label="Back to top"><ArrowUp size={19} /></a></footer>
  </div>;
}
