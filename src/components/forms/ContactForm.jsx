import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Download, X } from "lucide-react";
import { solutions } from "../../data/solutions";
import CursorDotTrail from "../ui/CursorDotTrail";

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL?.trim();

export default function ContactForm({ open, onClose, motionEnabled, dark = false }) {
  const ref = useRef(null);
  const [complete, setComplete] = useState(false);
  useEffect(() => {
    if (open && !ref.current.open) {
      document.dispatchEvent(new Event("navqriti:dialog-opening"));
      ref.current.showModal();
    }
    else if (!open && ref.current.open) ref.current.close();
  }, [open]);
  const submit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = `NAVQRITI — COLLABORATION BRIEF\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nOrganisation: ${data.get("organisation") || "Not provided"}\nArea of interest: ${data.get("interest")}\n\nThe opportunity\n${data.get("message")}\n`;
    if (contactEmail) {
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(`Collaboration enquiry: ${data.get("interest")}`)}&body=${encodeURIComponent(text)}`;
    } else {
      const url = URL.createObjectURL(
        new Blob([text], { type: "text/plain;charset=utf-8" }),
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "NavQriti-collaboration-brief.txt";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
    setComplete(true);
  };
  return (
    <dialog
      className={`contact-dialog ${dark ? "contact-dialog--dark" : ""}`}
      ref={ref}
      aria-labelledby="contact-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      data-lenis-prevent
    >
      <CursorDotTrail motionEnabled={motionEnabled && open} portal={false} />
      <div className="contact-dialog-inner">
        <div className="contact-dialog-top">
          <span className="eyebrow">LET’S CREATE WHAT COMES NEXT</span>
          <button
            className="icon-button"
            aria-label="Close contact form"
            onClick={onClose}
          >
            <X size={22} />
          </button>
        </div>
        <h2 id="contact-title">
          Great things start
          <br />
          with a conversation.
        </h2>
        <p className="contact-intro">
          Tell us about the challenge you’re exploring.
        </p>
        {complete ? (
          <div className="contact-success" role="status">
            <Check size={32} strokeWidth={1.3} />
            <h3>
              {contactEmail
                ? "Your email draft is ready."
                : "Your brief is ready."}
            </h3>
            <p>
              {contactEmail
                ? "Complete and send your enquiry in your email app. If it did not open, you can use the address below."
                : "Your project brief has been downloaded. Nothing has been sent or stored on a server."}
            </p>
            {contactEmail && (
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            )}
            <button
              className="underlined-link"
              onClick={() => setComplete(false)}
            >
              Prepare another brief <ArrowUpRight size={16} />
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="form-grid">
              <label>
                Your name <span>*</span>
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  placeholder="Full name"
                />
              </label>
              <label>
                Email address <span>*</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                  placeholder="you@organisation.com"
                />
              </label>
            </div>
            <label>
              Organisation
              <input
                name="organisation"
                autoComplete="organization"
                maxLength={150}
                placeholder="Where you’re building the future"
              />
            </label>
            <label>
              Area of interest
              <select name="interest" defaultValue="">
                <option value="" disabled>
                  Select a capability
                </option>
                {solutions.map((solution) => (
                  <option key={solution.id}>{solution.title}</option>
                ))}
                <option>Research partnership</option>
                <option>Something new</option>
              </select>
            </label>
            <label>
              What are you working on? <span>*</span>
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={3000}
                rows={3}
                placeholder="A question, an idea, or a challenge worth solving…"
              />
            </label>
            <p className="form-note">
              {contactEmail
                ? "This opens your email app with a prepared enquiry. You choose when to send it."
                : "Prepare a downloadable brief. Direct enquiries will be available when our contact channel is connected."}
            </p>
            <button className="button button--dark form-submit" type="submit">
              {contactEmail
                ? "Prepare email enquiry"
                : "Download project brief"}
              {contactEmail ? (
                <ArrowUpRight size={18} />
              ) : (
                <Download size={18} />
              )}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
