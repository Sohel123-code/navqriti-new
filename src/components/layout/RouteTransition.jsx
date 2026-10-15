import { useEffect, useRef, useState } from "react";

// Real links retain history, new-tab behavior and a no-motion path.
export default function RouteTransition({ motionEnabled }) {
  const [destination, setDestination] = useState(null);
  const navigating = useRef(false);
  useEffect(() => {
    let timer;
    const reset = () => { clearTimeout(timer); navigating.current = false; setDestination(null); };
    const navigate = (event) => {
      if (!motionEnabled || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const link = event.target.closest?.("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !/^\/(ai|quantum|contact)\/?$/.test(url.pathname) || url.pathname === location.pathname) return;
      event.preventDefault();
      if (navigating.current) return;
      navigating.current = true;
      const rect = link.getBoundingClientRect();
      link.closest("dialog")?.close();
      setDestination({ label: url.pathname.includes("contact") ? "Pricing & Contact" : url.pathname.includes("quantum") ? "Quantum" : "AI", quantum: url.pathname.includes("quantum"), x: event.detail ? event.clientX : rect.x + rect.width / 2, y: event.detail ? event.clientY : rect.y + rect.height / 2 });
      timer = setTimeout(() => location.assign(url.href), 720);
    };
    document.addEventListener("click", navigate);
    window.addEventListener("pageshow", reset);
    return () => { clearTimeout(timer); navigating.current = false; document.removeEventListener("click", navigate); window.removeEventListener("pageshow", reset); };
  }, [motionEnabled]);
  if (!destination) return null;
  return <div className={`route-iris ${destination.quantum ? "route-iris--quantum" : ""}`} style={{ "--iris-x": `${destination.x}px`, "--iris-y": `${destination.y}px` }} role="status" aria-label={`Opening NavQriti ${destination.label}`}>
    <div className="route-iris-art" aria-hidden="true">
      <svg viewBox="0 0 360 360"><g className="route-orbits"><ellipse cx="180" cy="180" rx="135" ry="55" /><ellipse cx="180" cy="180" rx="135" ry="55" transform="rotate(60 180 180)" /><ellipse cx="180" cy="180" rx="135" ry="55" transform="rotate(120 180 180)" /></g><g className="route-points">{Array.from({ length: 42 }, (_, i) => { const angle = i * 2.39996, radius = 24 + (i % 13) * 9; return <circle key={i} cx={180 + Math.cos(angle) * radius} cy={180 + Math.sin(angle) * radius} r={i % 3 === 0 ? 1.8 : 1} />; })}</g><circle className="route-core" cx="180" cy="180" r="4" /></svg>
      <span>NAVQRITI / {destination.label.toUpperCase()}</span>
    </div>
  </div>;
}
