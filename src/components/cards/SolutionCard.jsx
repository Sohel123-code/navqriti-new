import { AnimatePresence, motion as Motion } from "framer-motion";
import {
  ArrowUpRight,
  Plus,
  Minus,
  Orbit,
  Box,
  Layers,
  Compass,
} from "lucide-react";
import { accordionTransition } from "../../animations/framer/transitions";
const icons = { orbit: Orbit, box: Box, layers: Layers, compass: Compass };

export default function SolutionCard({
  solution,
  open,
  onToggle,
  onContact,
  motionEnabled,
}) {
  const Icon = icons[solution.icon];
  return (
    <article className={`solution-row ${open ? "is-open" : ""}`} data-reveal>
      <h3>
        <button
          className="solution-toggle"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`solution-${solution.id}`}
        >
          <span className="solution-number mono">{solution.number}</span>
          <span>{solution.title}</span>
          <span className="solution-symbol">
            {open ? <Minus size={21} /> : <Plus size={21} />}
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <Motion.div
            key="content"
            id={`solution-${solution.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={motionEnabled ? accordionTransition : { duration: 0 }}
            className="solution-content"
          >
            <div className="solution-detail">
              <p>{solution.description}</p>
              <div className="solution-tags">
                {solution.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <button className="underlined-link" onClick={onContact}>
                Explore a collaboration <ArrowUpRight size={16} />
              </button>
            </div>
            <Icon
              className="solution-illustration"
              size={116}
              strokeWidth={0.65}
              aria-hidden="true"
            />
          </Motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
