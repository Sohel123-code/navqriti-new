// Share import promises between intent preloading and React.lazy.
let ai;
let quantum;
export const loadAI = () => (ai ??= import("./ArtificialIntelligence").catch(error => { ai = null; throw error; }));
export const loadQuantum = () => (quantum ??= import("./Quantum").catch(error => { quantum = null; throw error; }));
export const normalizePath = path => path.replace(/\/$/, "") || "/";
export const isPagePath = path => ["/", "/ai", "/quantum", "/contact"].includes(normalizePath(path));
let poster;
export function preloadPage(path) {
  if (normalizePath(path) === "/ai" && !poster) {
    poster = new Image();
    poster.src = window.innerWidth < 768 ? "/images/ai/orb-poster-mobile.png" : "/images/ai/orb-poster.png";
  }
  switch (normalizePath(path)) {
    case "/ai": return loadAI();
    case "/quantum": return loadQuantum();
    default: return Promise.resolve();
  }
}
