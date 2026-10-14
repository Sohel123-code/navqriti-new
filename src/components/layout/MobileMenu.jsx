import { useEffect, useRef } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { navigation } from "../../data/navigation";

export default function MobileMenu({ open, onClose, onContact }) {
  const ref = useRef(null);
  useEffect(() => {
    if (open && !ref.current.open) ref.current.showModal();
    else if (!open && ref.current.open) ref.current.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="mobile-menu"
      aria-label="Navigation"
      onCancel={onClose}
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
          <a key={item.href} href={item.href} onClick={onClose}>
            <span className="mono">0{index + 1}</span>
            {item.label}
            <ArrowUpRight size={22} />
          </a>
        ))}
      </nav>
      <button
        className="button button--dark"
        onClick={() => {
          onClose();
          onContact();
        }}
      >
        Let’s talk <ArrowUpRight size={18} />
      </button>
      <p className="eyebrow">Discover. Create. Deploy.</p>
    </dialog>
  );
}
