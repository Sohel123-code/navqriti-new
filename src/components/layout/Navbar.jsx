import { useState } from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import { navigation } from "../../data/navigation";
import Container from "../ui/Container";
import MobileMenu from "./MobileMenu";

export default function Navbar({ onContact }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="navbar">
        <Container className="navbar-inner">
          <a href="#home" className="brand" aria-label="NavQriti home">
            <img
              src="/logos/navqriti.jpeg"
              alt="NavQriti"
              width="469"
              height="156"
            />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <button className="nav-contact" onClick={onContact}>
            Let’s talk <ArrowUpRight size={17} />
          </button>
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
        onContact={onContact}
      />
    </>
  );
}
