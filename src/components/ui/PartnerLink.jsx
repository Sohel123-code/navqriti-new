import { ArrowUpRight } from "lucide-react";

export default function PartnerLink({ dark = false, className = "" }) {
  return <div className={`section-action ${dark ? "section-action--dark" : ""} ${className}`}>
    <a className="partner-link" href="/contact">Partner with us <ArrowUpRight size={18} aria-hidden="true" /></a>
  </div>;
}
