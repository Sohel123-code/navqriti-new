// Adapted from https://framer.com/m/image-animation-HJJB.js@ga1htqyg5UFN9eq91lZh
// Expanding image strips, gradient masks, .3s layout easing and staggered
// blur-to-clear captions; extended from five source panels to six company stages.
import { motion as Motion } from "framer-motion";

const functions = ["Find opportunities.", "Build knowledge.", "Create prototypes.", "Test performance.", "Launch solutions.", "Expand impact."];

export default function ImageAccordion({ items, active, onSelect, motionEnabled }) {
  const keyboard = (event, index) => {
    let next = index;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % items.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (index + items.length - 1) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    onSelect(next);
    event.currentTarget.parentElement.parentElement.querySelectorAll(".image-stage-trigger")[next].focus({ preventScroll: true });
  };
  return (
    <div className="image-accordion" data-component="FramerImageAnimation">
      {items.map((stage, index) => (
        <article className={`image-stage ${active === index ? "is-expanded" : ""}`} key={stage.number}>
          <img className="image-stage-art" src={`/images/approach/${stage.title.toLowerCase()}.webp`} alt="" loading="lazy" />
          <div className="image-stage-shade" />
          <button className="image-stage-trigger" aria-expanded={active === index} aria-controls={`stage-copy-${index}`} onClick={() => onSelect(index)} onKeyDown={(event) => keyboard(event, index)}>
            <span className="mono">{stage.number}</span><span>{stage.title}</span><span className="image-stage-plus" aria-hidden="true">{active === index ? "−" : "+"}</span>
          </button>
          <div id={`stage-copy-${index}`} hidden={active !== index}>
          {active === index && (
            <Motion.div className="image-stage-copy" key={stage.title}
              initial={motionEnabled ? { opacity: 0, y: 25, filter: "blur(10px)" } : false}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: motionEnabled ? .6 : 0, delay: motionEnabled ? .2 : 0, ease: [.12, .23, .5, 1] }}>
              <p>{functions[index]}</p>
            </Motion.div>
          )}
          </div>
        </article>
      ))}
    </div>
  );
}
