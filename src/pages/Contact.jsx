import { useEffect } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import "../contact.css";

export default function Contact({ onContact }) {
  const email = import.meta.env.VITE_CONTACT_EMAIL?.trim();
  useEffect(() => {
    document.title = "NavQriti — Partnerships";
    const theme = document.querySelector('meta[name="theme-color"]');
    const description = document.querySelector('meta[name="description"]');
    const previousTheme = theme?.content;
    const previousDescription = description?.content;
    theme?.setAttribute("content", "#050505");
    description?.setAttribute("content", "Explore NavQriti AI tools, campus computing and research partnerships.");
    return () => {
      if (previousTheme) theme.content = previousTheme;
      if (previousDescription) description.content = previousDescription;
    };
  }, []);
  return <main id="main" className="partnership-page">
    <div className="partnership-wrap">
      <section className="partnership-intro" aria-labelledby="partnership-title">
        <div>
          <p className="partnership-kicker">NAVQRITI / PARTNERSHIPS</p>
          <h1 id="partnership-title">Access possibilities.<br /><span>Build together.</span></h1>
          <p>AI tools and campus computing. One partnership.</p>
        </div>
        <div className="partnership-orbit" aria-hidden="true"><i /><i /><i /><span /></div>
      </section>
      <section id="opportunities" className="partnership-opportunities" aria-labelledby="opportunities-title">
        <h2 id="opportunities-title" className="partnership-kicker">01 / WORK WITH NAVQRITI</h2>
        <div className="partnership-offering-row"><div><h3>AI access</h3><p>Claude & GPT, with research support.</p></div><a href="/ai#ai-workflow">Explore AI <ArrowUpRight size={17} /></a></div>
        <div className="partnership-offering-row"><div><h3>Campus GPU access</h3><p>Shared computing for students and faculty.</p></div><a href="/quantum#quantum-campus">Explore Quantum <ArrowUpRight size={17} /></a></div>
      </section>
      <section id="partnership-contact" className="partnership-contact" aria-labelledby="partnership-contact-title">
        <div><p className="partnership-kicker">02 / LET’S CONNECT</p><h2 id="partnership-contact-title">Partner with us.</h2></div>
        <div className="partnership-contact-action">
          <button className="partner-link" onClick={onContact}>{email ? "Prepare an enquiry" : "Prepare a partnership brief"}{email ? <ArrowUpRight size={18} /> : <Download size={18} />}</button>
          <p>{email ? "Opens your email app. You choose when to send." : "Download a brief. Direct enquiries are not connected yet."}</p>
          {email && <a href={`mailto:${email}`}>{email}</a>}
        </div>
      </section>
      <footer className="partnership-footer"><span>NAVQRITI / LEARN. RESEARCH. BUILD.</span><a href="/">Back to home <ArrowUpRight size={16} /></a></footer>
    </div>
  </main>;
}
