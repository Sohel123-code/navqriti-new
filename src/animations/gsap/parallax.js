// One scroll clock for the page and its WebGL scenes. No React renders or layout
// reads on scroll; geometry is measured only when the document changes size.
const states = new WeakMap();
const neutral = { offset: 0, velocity: 0, strength: 0, enabled: false };
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function getSceneScroll(host) {
  const element = host.closest("[data-scroll-scene]");
  if (!element) return neutral;
  if (!states.has(element)) states.set(element, { ...neutral });
  return states.get(element);
}

export function createCinematicScroll(scope) {
  const records = [...scope.querySelectorAll("[data-scroll-scene]")].map(
    (element) => ({
      element,
      state: getSceneScroll(element),
      top: 0,
      height: 1,
    }),
  );
  const active = new Set();
  let frame = 0;
  let lastTime = 0;
  let previousY = window.scrollY;
  let viewport = window.innerHeight;
  let measureNeeded = true;
  let disposed = false;

  const measure = () => {
    viewport = window.innerHeight;
    for (const record of records) {
      // offsetTop ignores the entrance transforms on the nested name section.
      let node = record.element;
      record.top = 0;
      while (node) {
        record.top += node.offsetTop;
        node = node.offsetParent;
      }
      record.height = record.element.offsetHeight;
      record.state.strength = window.innerWidth < 768 ? 0.4 : 1;
    }
    measureNeeded = false;
  };
  const draw = (time) => {
    frame = 0;
    if (disposed || document.hidden) return;
    if (measureNeeded) measure();
    const delta = Math.min((time - lastTime) / 1000 || 1 / 60, 0.05);
    lastTime = time;
    const y = window.scrollY;
    const speed = clamp((y - previousY) / delta / 1800, -1, 1);
    previousY = y;
    const blend = 1 - Math.exp(-delta * 14);
    let settling = false;
    for (const record of records) {
      if (!active.has(record.element)) continue;
      const { element, state, top, height } = record;
      const target = clamp(
        (y + viewport / 2 - top - height / 2) / ((viewport + height) / 2),
        -1,
        1,
      );
      if (!state.enabled) state.offset = target;
      state.enabled = true;
      state.offset += (target - state.offset) * blend;
      state.velocity += (speed - state.velocity) * blend;
      settling ||=
        Math.abs(target - state.offset) > 0.0001 ||
        Math.abs(state.velocity) > 0.001;
      element.style.setProperty(
        "--scroll-shift",
        (state.offset * state.strength).toFixed(5),
      );
      element.style.setProperty(
        "--scroll-distance",
        (Math.abs(state.offset) * state.strength).toFixed(5),
      );
    }
    if (settling) schedule();
  };
  const schedule = () => {
    if (!frame && !disposed) frame = requestAnimationFrame(draw);
  };
  const resize = () => {
    measureNeeded = true;
    schedule();
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) active.add(target);
        else active.delete(target);
      }
      schedule();
    },
    { rootMargin: "15% 0px" },
  );
  const resizeObserver = new ResizeObserver(resize);
  records.forEach(({ element }) => {
    observer.observe(element);
    resizeObserver.observe(element);
  });
  scope.dataset.cinematic = "true";
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", schedule);
  document.fonts.ready.then(() => {
    if (!disposed) resize();
  });
  schedule();
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    resizeObserver.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", resize);
    document.removeEventListener("visibilitychange", schedule);
    delete scope.dataset.cinematic;
    records.forEach(({ element, state }) => {
      Object.assign(state, neutral);
      element.style.removeProperty("--scroll-shift");
      element.style.removeProperty("--scroll-distance");
    });
  };
}
