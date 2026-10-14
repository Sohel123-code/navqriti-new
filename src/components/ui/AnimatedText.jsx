import { useLayoutEffect, useRef } from "react";
import { revealCharacters } from "../../animations/gsap/textReveal";

export default function AnimatedText({
  text,
  as: Tag = "h2",
  className = "",
  motionEnabled = true,
  decorative = false,
}) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    if (!motionEnabled) return;
    const animation = revealCharacters(ref.current);
    return () => animation.revert();
  }, [motionEnabled, text]);
  return (
    <Tag
      ref={ref}
      className={`animated-text ${className}`}
      aria-label={decorative ? undefined : text}
      aria-hidden={decorative || undefined}
    >
      <span aria-hidden="true">
        {text.split(" ").map((word, index) => (
          <span className="animated-word" key={index}>
            {Array.from(word).map((char, i) => (
              <span className="animated-character" key={i}>
                {char}
              </span>
            ))}
            {index < text.split(" ").length - 1 && " "}
          </span>
        ))}
      </span>
    </Tag>
  );
}
