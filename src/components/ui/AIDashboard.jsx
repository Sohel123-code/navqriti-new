import { useState } from "react";
import { Code2, GraduationCap, LayoutDashboard, Sparkles, Check, ArrowUpRight } from "lucide-react";

const demos = [
  { name: "Code guidance", code: ["def average(values):", "    total = sum(values)", "    return total / len(values)", "", "average([])"], title: "Think about the empty input.", text: "What happens when len(values) is zero? Add a guard, then explain why it is needed.", status: "Reason through the edge case" },
  { name: "Assessment", code: ["01  Explain your approach", "02  Walk through the code", "03  Test the edge cases", "04  Review your reasoning", "", "Powered by Nextmo"], title: "Make your thinking visible.", text: "An assessment connects your implementation with the logic behind it.", status: "Explain · demonstrate · reflect" },
  { name: "AI literacy", code: ["problem → prompt", "prompt  → prototype", "review  → understanding", "test    → refinement", "", "Build it. Explain it."], title: "AI helps you build. You own the logic.", text: "Use the tool, inspect the output and demonstrate how the solution works.", status: "Guided, responsible AI use" },
];
export default function AIDashboard() {
  const [selected, setSelected] = useState(0);
  const demo = demos[selected];
  return <div className="ai-dashboard">
    <aside><span className="ai-dashboard-symbol"><Sparkles size={21} /></span><LayoutDashboard size={17} /><Code2 size={17} /><GraduationCap size={17} /></aside>
    <div className="ai-dashboard-body">
      <header><strong>NavQriti <span>/ Learning workspace</span></strong><span className="ai-mini">INTERACTIVE DEMO</span></header>
      <div className="ai-demo-tabs" role="tablist" aria-label="Learning workspace demo">{demos.map((d, i) => <button key={d.name} id={`demo-tab-${i}`} role="tab" aria-selected={selected === i} aria-controls="ai-demo-panel" tabIndex={selected === i ? 0 : -1} onClick={() => setSelected(i)} onKeyDown={e => { if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) { e.preventDefault(); const next = e.key === "Home" ? 0 : e.key === "End" ? 2 : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3; setSelected(next); document.getElementById(`demo-tab-${next}`)?.focus(); } }}>{d.name}</button>)}</div>
      <div className="ai-demo-content" id="ai-demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${selected}`}>
        <div className="ai-code"><div className="ai-mini">{selected === 0 ? "EXAMPLE.PY" : "LEARNING PATH"}<Code2 size={13} /></div><pre>{demo.code.map((line, i) => <span key={`${selected}-${i}`}><em>{String(i + 1).padStart(2, "0")}</em>{line || " "}</span>)}</pre><span className="ai-code-footer"><Check size={12} /> {demo.status}</span></div>
        <div className="ai-feedback" key={selected}><Sparkles size={22} /><span className="ai-mini">LEARNING ASSISTANT</span><h3>{demo.title}</h3><p>{demo.text}</p><ArrowUpRight size={20} /></div>
      </div>
      <footer><span><i /> AI-assisted learning</span><span>Illustrative workflow · no student data</span></footer>
    </div>
  </div>;
}
