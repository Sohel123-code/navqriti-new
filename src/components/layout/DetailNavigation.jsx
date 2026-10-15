import { ArrowLeft, ArrowUpRight } from "lucide-react";
import "../../detail-navigation.css";

export default function DetailNavigation({ quantum }) {
  return <nav className="detail-navigation" aria-label="Explore NavQriti">
    <a className="detail-home" href="/#frontiers" aria-label="Back to NavQriti homepage">
      <span className="detail-home-arrow"><ArrowLeft size={18} /></span>
      <span><small>BACK TO HOME</small><strong>NavQriti<span>.</span></strong></span>
    </a>
    <a className="detail-sibling" href={quantum ? "/ai" : "/quantum"}>
      {quantum ? "AI" : "Quantum"}<ArrowUpRight size={14} />
    </a>
  </nav>;
}
