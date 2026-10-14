import gsap from "gsap";

export function revealCharacters(element) {
  const characters = [...element.querySelectorAll(".animated-character")];
  const step = characters.length < 10 ? 0.14 : 0.04;
  let caret = -1;
  let timeline;
  const context = gsap.context(() => {
    timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.45,
      paused: true,
      onUpdate() {
        const next = Math.min(
          characters.length - 1,
          Math.floor(this.time() / step),
        );
        if (next === caret) return;
        if (characters[caret]) delete characters[caret].dataset.caret;
        if (characters[next]) characters[next].dataset.caret = "true";
        caret = next;
      },
    });
    timeline
      .fromTo(
        characters,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.01,
          stagger: step,
          ease: "none",
          immediateRender: false,
        },
      )
      .to({}, { duration: 5.5 })
      .to(characters, {
        opacity: 0,
        duration: 0.08,
        stagger: { each: 0.012, from: "end" },
        ease: "none",
      });
  }, element);
  let visible = false;
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !document.hidden) timeline.restart();
    else timeline.pause();
  });
  observer.observe(element);
  const visibility = () => {
    if (visible && !document.hidden) timeline.resume();
    else timeline.pause();
  };
  document.addEventListener("visibilitychange", visibility);
  return {
    revert() {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      context.revert();
      characters.forEach((character) => delete character.dataset.caret);
    },
  };
}
