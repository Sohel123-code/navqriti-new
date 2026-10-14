import gsap from "gsap";

// A timed playhead moves the panels without changing the document scroll position.
export function createStageShowcase(scope, progressRef, onStage, onPlaying) {
  const pin = scope.querySelector(".showcase-pin");
  const panels = [...scope.querySelectorAll(".showcase-panel")];
  const captions = [...scope.querySelectorAll(".showcase-caption")];
  const meter = scope.querySelector(".showcase-progress-fill");
  const backNumber = scope.querySelector(".showcase-ghost-number");
  const playhead = { value: 0 };
  let active = -1;
  let film;
  let userPaused = false;
  let visible = false;
  let context;
  const layouts = [
    {
      spread: 1,
      vertical: 42,
      depth: 240,
      tilt: 31,
      roll: -3,
      scale: 1,
      stack: 0,
    },
    {
      spread: 1.05,
      vertical: -35,
      depth: 210,
      tilt: 24,
      roll: 2,
      scale: 1,
      stack: 0,
    },
    {
      spread: 0.68,
      vertical: -25,
      depth: 320,
      tilt: 13,
      roll: -5,
      scale: 1.02,
      stack: 24,
    },
    {
      spread: 1.12,
      vertical: 0,
      depth: 360,
      tilt: 42,
      roll: 0,
      scale: 1.05,
      stack: 0,
    },
    {
      spread: 0.92,
      vertical: 105,
      depth: 200,
      tilt: 26,
      roll: 4,
      scale: 1,
      stack: -12,
    },
    {
      spread: 0.84,
      vertical: -55,
      depth: 170,
      tilt: 20,
      roll: -2,
      scale: 0.96,
      stack: 0,
    },
  ];
  const render = () => {
    const value = playhead.value % 6;
    const mobile = window.innerWidth < 650;
    const distance = mobile ? 225 : Math.min(window.innerWidth * 0.31, 470);
    const from = Math.min(5, Math.floor(value));
    const layout = gsap.utils.interpolate(
      layouts[from],
      layouts[(from + 1) % 6],
      value - from,
    );
    panels.forEach((panel, index) => {
      const offset = ((index - value + 9) % 6) - 3;
      const separation = Math.abs(offset);
      const opacity =
        separation > 2.1 ? 0 : gsap.utils.clamp(0, 1, 1 - separation * 0.49);
      gsap.set(panel, {
        xPercent: -50,
        yPercent: -50,
        x: offset * distance * layout.spread,
        y:
          (Math.sin(offset * 1.25) * layout.vertical +
            separation * layout.stack) *
          (mobile ? 0.45 : 1),
        z: -separation * layout.depth,
        rotationY: gsap.utils.clamp(-52, 52, offset * -layout.tilt),
        rotationX: separation * 3,
        rotationZ: offset * layout.roll,
        scale: layout.scale - Math.min(separation, 3) * 0.035,
        opacity,
        visibility: opacity === 0 ? "hidden" : "visible",
        zIndex: 20 - Math.round(separation * 4),
      });
    });
    const next = Math.round(value) % 6;
    if (next !== active) {
      active = next;
      onStage(next);
    }
    captions.forEach((caption, index) => {
      const offset = ((index - value + 9) % 6) - 3;
      const separation = Math.abs(offset);
      gsap.set(caption, {
        opacity: Math.max(0, 1 - separation * 2.3),
        y: offset * 24,
        visibility: separation < 0.5 ? "visible" : "hidden",
      });
    });
    gsap.set(meter, { scaleX: (value + 0.2) / 6.2 });
    gsap.set(backNumber, { y: -value * 12, x: value * -9 });
    progressRef.current.progress = value / 5;
    scope.dataset.stage = String(next);
  };
  const sync = () => {
    const playing = visible && !document.hidden && !userPaused;
    if (playing) film.resume();
    else film.pause();
    pin.dataset.active = String(playing);
    progressRef.current.running = playing;
    onPlaying(playing);
  };
  let entrance;
  context = gsap.context(() => {
    film = gsap.timeline({ paused: true, repeat: -1, onUpdate: render });
    for (let index = 1; index <= 6; index++) {
      film.to(
        playhead,
        { value: index, duration: 1, ease: "sine.inOut" },
        index * 3 - 1,
      );
    }
    entrance = gsap.fromTo(
      [
        scope.querySelector(".showcase-intro"),
        scope.querySelector(".showcase-stage"),
      ],
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        paused: true,
      },
    );
    render();
  }, scope);
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) entrance.restart();
      sync();
    },
    { threshold: 0.2 },
  );
  observer.observe(scope);
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("resize", render);
  return {
    seek(index) {
      film.time(index * 3);
      render();
      sync();
    },
    togglePlay() {
      userPaused = !userPaused;
      sync();
    },
    destroy() {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", render);
      film.kill();
      context.revert();
      progressRef.current.running = false;
      delete pin.dataset.active;
      delete scope.dataset.stage;
    },
  };
}
