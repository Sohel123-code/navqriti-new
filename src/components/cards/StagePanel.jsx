const headlines = [
  "Question everything.",
  "Connect the evidence.",
  "Make the possible real.",
  "Prove what matters.",
  "Move into the world.",
  "Multiply the impact.",
];
const signals = [
  "CURIOSITY → POSSIBILITY",
  "EVIDENCE → KNOWLEDGE",
  "KNOWLEDGE → PROTOTYPE",
  "EXPERIMENT → CONFIDENCE",
  "CAPABILITY → APPLICATION",
  "INNOVATION → IMPACT",
];

function StageDiagram({ index }) {
  const nodes = Array.from({ length: 8 }, (_, i) => ({
    x: 210 + Math.cos((i * Math.PI) / 4) * 116,
    y: 108 + Math.sin((i * Math.PI) / 4) * 70,
  }));
  return (
    <svg
      className={`stage-diagram diagram-${index}`}
      viewBox="0 0 420 216"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M18 18h12m-6-6v12M390 198h12m-6-6v12"
        stroke="#666"
        strokeWidth="0.6"
      />
      {index === 0 && (
        <g>
          {[34, 62, 89].map((r) => (
            <circle
              key={r}
              cx="210"
              cy="108"
              r={r}
              stroke="#898989"
              strokeWidth="0.6"
            />
          ))}
          <path
            d="M102 108h216M210 0v216"
            stroke="#555"
            strokeWidth="0.5"
            strokeDasharray="2 6"
          />
          <g className="radar-sweep">
            <path d="M210 108L281 55A89 89 0 0 0 210 19Z" fill="#ffffff0b" />
            <path d="M210 108L210 19" stroke="white" strokeWidth="1.3" />
          </g>
          {[
            [176, 68],
            [261, 139],
            [189, 160],
          ].map(([x, y], i) => (
            <g
              key={x}
              className="signal-point"
              style={{ animationDelay: `-${i}s` }}
            >
              <circle cx={x} cy={y} r="3" fill="white" />
              <circle cx={x} cy={y} r="9" stroke="#bbb" strokeWidth="0.6" />
            </g>
          ))}
          <circle cx="210" cy="108" r="5" fill="white" />
        </g>
      )}
      {index === 1 && (
        <g>
          {nodes.map(({ x, y }, i) => (
            <g key={i}>
              <path
                className="signal-path"
                d={`M210 108L${x} ${y}L${nodes[(i + 3) % 8].x} ${nodes[(i + 3) % 8].y}`}
                stroke="#939393"
                strokeWidth="0.8"
                style={{ animationDelay: `-${i * 0.3}s` }}
              />
              <circle
                className="signal-point"
                cx={x}
                cy={y}
                r={i % 2 ? 3 : 5}
                fill="white"
                style={{ animationDelay: `-${i * 0.3}s` }}
              />
            </g>
          ))}
          <circle cx="210" cy="108" r="24" fill="#151515" stroke="#eee" />
          <circle cx="210" cy="108" r="7" fill="white" />
        </g>
      )}
      {index === 2 && (
        <g>
          {[0, 1, 2].map((i) => (
            <g
              key={i}
              className="prototype-layer"
              style={{ animationDelay: `-${i * 0.8}s` }}
              transform={`translate(0 ${i * 39 - 39})`}
            >
              <path
                d="M107 111L210 65L313 111L210 157Z"
                stroke={i === 1 ? "white" : "#888"}
                fill="#161616"
              />
              <path
                d="M158 88L261 134M158 134L261 88M107 111H313M210 65V157"
                stroke="#6b6b6b"
                strokeWidth="0.6"
              />
              <circle cx="210" cy="111" r="4" fill="white" />
            </g>
          ))}
        </g>
      )}
      {index === 3 && (
        <g>
          <rect x="133" y="27" width="154" height="162" rx="8" stroke="#555" />
          <circle
            cx="210"
            cy="102"
            r="48"
            stroke="#777"
            strokeDasharray="2 5"
          />
          <circle
            className="validation-ring"
            cx="210"
            cy="102"
            r="48"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="180 122"
          />
          <path
            className="validation-check"
            d="M187 103L203 119L235 85"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M173 167h74" stroke="#777" strokeWidth="2" />
          <path
            className="validation-scan"
            d="M122 41H298"
            stroke="#fff"
            strokeWidth="0.7"
          />
        </g>
      )}
      {index === 4 && (
        <g>
          {nodes
            .filter((_, i) => i % 2 === 0)
            .map(({ x, y }, i) => (
              <g key={i}>
                <path
                  className="deployment-route"
                  d={`M210 108L${x} ${y}`}
                  stroke="white"
                  strokeWidth="1"
                />
                <rect
                  x={x - 13}
                  y={y - 10}
                  width="26"
                  height="20"
                  rx="3"
                  fill="#151515"
                  stroke="#ddd"
                />
                <circle
                  className="signal-point"
                  cx={x}
                  cy={y}
                  r="3"
                  fill="white"
                  style={{ animationDelay: `-${i * 0.6}s` }}
                />
              </g>
            ))}
          <path
            d="M187 95L210 82L233 95V122L210 135L187 122Z"
            fill="#222"
            stroke="white"
          />
          <path d="M187 95L210 108L233 95M210 108V135" stroke="#ddd" />
          <circle
            className="deploy-wave"
            cx="210"
            cy="108"
            r="45"
            stroke="#fff"
            strokeWidth=".6"
          />
        </g>
      )}
      {index === 5 && (
        <g className="scale-globe">
          <circle cx="210" cy="108" r="86" stroke="#aaa" />
          {[24, 52, 76].map((rx) => (
            <ellipse
              key={rx}
              cx="210"
              cy="108"
              rx={rx}
              ry="86"
              stroke="#777"
              strokeWidth="0.6"
            />
          ))}
          {[30, 60].map((ry) => (
            <ellipse
              key={ry}
              cx="210"
              cy="108"
              rx="86"
              ry={ry}
              stroke="#777"
              strokeWidth="0.6"
            />
          ))}
          <path d="M124 108H296" stroke="#aaa" />
          <g className="scale-orbit">
            <ellipse
              cx="210"
              cy="108"
              rx="113"
              ry="34"
              stroke="white"
              strokeWidth=".8"
              transform="rotate(-25 210 108)"
            />
            <circle cx="312" cy="60" r="4" fill="white" />
          </g>
        </g>
      )}
    </svg>
  );
}

export default function StagePanel({ stage, index, motionEnabled }) {
  return (
    <article
      className="showcase-panel"
      data-panel={index}
      aria-hidden={motionEnabled || undefined}
    >
      <div className="stage-panel-bar">
        <span className="mono">NAVQRITI / {stage.number}</span>
        <span className="panel-status">
          <i />
          {stage.title.toUpperCase()}
        </span>
      </div>
      <StageDiagram index={index} />
      <h3>{headlines[index]}</h3>
      <div className="stage-panel-footer">
        <span>{signals[index]}</span>
        <span>↗</span>
      </div>
      {!motionEnabled && (
        <p className="static-stage-description">{stage.description}</p>
      )}
    </article>
  );
}
