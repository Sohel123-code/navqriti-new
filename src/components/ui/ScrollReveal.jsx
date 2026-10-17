import { useRef, useState } from "react";
import { motion as Motion, useScroll, useTransform } from "framer-motion";

// Scroll position, rather than a one-time timer, controls entry and exit.
// The same path plays backwards when the visitor scrolls back up.
export default function ScrollReveal({ children, motionEnabled, className = "", as = "div", style }) {
  const ref = useRef(null);
  const [focused, setFocused] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, .15, .8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, .15, .8, 1], [28, 0, 0, -24]);
  const scale = useTransform(scrollYProgress, [0, .15, .8, 1], [.98, 1, 1, .985]);
  const Element = as === "article" ? Motion.article : Motion.div;
  return <Element ref={ref} className={className} data-scroll-reveal
    style={{ ...style, opacity: motionEnabled && !focused ? opacity : 1, y: motionEnabled ? y : 0, scale: motionEnabled ? scale : 1 }}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    {children}
  </Element>;
}
