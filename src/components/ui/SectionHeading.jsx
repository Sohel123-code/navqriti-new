export default function SectionHeading({ number, children, light = false }) {
  return (
    <p className={`eyebrow section-eyebrow ${light ? "is-light" : ""}`}>
      <span className="section-index">{number}</span>
      {children}
    </p>
  );
}
