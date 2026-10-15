import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { navigation } from "../../data/navigation";

export default function MobileMenu({ open, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    if (open && !ref.current.open) {
      document.dispatchEvent(new Event("navqriti:dialog-opening"));
      ref.current.showModal();
    }
    else if (!open && ref.current.open) ref.current.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="mobile-menu"
      aria-label="Navigation"
      data-lenis-prevent
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mobile-menu-top">
        <span className="wordmark">
          NavQriti<span>↗</span>
        </span>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close navigation"
        >
          <X />
        </button>
      </div>
      <nav>
        {navigation.map((item, index) => (
          <a key={item.href} href={item.href} onClick={(event) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const url = new URL(item.href, window.location.origin);
            ref.current.close();
            onClose();
            if (url.pathname === window.location.pathname && url.hash) {
              event.preventDefault();
              requestAnimationFrame(() => {
                document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: "instant", block: "start" });
                window.history.replaceState(window.history.state, "", item.href);
              });
            }
          }}>
            <span className="mono">0{index + 1}</span>
            {item.label}
            <ArrowUpRight size={22} />
          </a>
        ))}
      </nav>
      <a className="partner-link" href="/contact">Partner with us <ArrowUpRight size={18} /></a>
      <p className="eyebrow">Discover. Create. Deploy.</p>
    </dialog>
  );
}
