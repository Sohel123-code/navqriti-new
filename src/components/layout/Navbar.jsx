import { useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import { navigation } from "../../data/navigation";
import Container from "../ui/Container";
import MobileMenu from "./MobileMenu";

export default function Navbar({ dark = false, mainId = "main" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href={`#${mainId}`}>
        Skip to content
      </a>
      <header className={`navbar shared-navbar ${dark ? "navbar--dark" : ""}`}>
        <Container className="navbar-inner">
          <a href="/" className="brand" aria-label="NavQriti home">
            {dark ? <span className="brand-wordmark">NavQriti</span> : <span className="brand-image">
            <img
              src="/logos/navqriti.jpeg"
              alt="NavQriti"
              width="469"
              height="156"
            />
            </span>}
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href} aria-current={window.location.pathname.replace(/\/$/, "") === item.href.replace(/\/$/, "") ? "page" : undefined}>
                {item.label}
              </a>
            ))}
          </nav>
          <a className="nav-contact" href="/contact">
            Partner with us <ArrowUpRight size={17} />
          </a>
          <button
            className="menu-toggle icon-button"
            aria-label="Open navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </button>
        </Container>
      </header>
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
