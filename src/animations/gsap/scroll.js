// Observe visibility in one batch instead of measuring every section at startup.
// Content remains readable before observers run or when animation is interrupted.
export function createScrollReveals(scope) {
  const elements = [...scope.querySelectorAll("[data-reveal]")];
  const tweens = new Map();
  let previousScroll = window.scrollY;
  let direction = 1;
  const scroll = () => {
    if (window.scrollY !== previousScroll)
      direction = window.scrollY > previousScroll ? 1 : -1;
    previousScroll = window.scrollY;
  };
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        tweens.get(target)?.cancel();
        if (!isIntersecting) {
          // Cancelling leaves the underlying readable DOM untouched.
          return;
        }
        target.dataset.enterDirection = direction > 0 ? "down" : "up";
        const cinematic = target.dataset.reveal === "cinematic";
        // Native compositor transforms coexist with scroll-linked translate /
        // rotate / scale. GSAP normalizes those properties and would erase them.
        const tween = target.animate(
          [
            {
              opacity: 0,
              transform: `translateY(${direction * (cinematic ? 30 : 22)}px) scale(${cinematic ? 0.99 : 1})`,
            },
            { opacity: 1, transform: "translateY(0) scale(1)" },
          ],
          {
            duration: cinematic ? 950 : 750,
            easing: "cubic-bezier(.22,1,.36,1)",
            delay: Number(target.dataset.delay || 0) * 1000,
            fill: "backwards",
          },
        );
        tweens.set(target, tween);
      });
    },
    { rootMargin: "0px 0px -3% 0px" },
  );
  elements.forEach((element) => observer.observe(element));
  window.addEventListener("scroll", scroll, { passive: true });
  const ambientElements = scope.querySelectorAll("[data-ambient]");
  const ambientObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      target.dataset.inView = String(isIntersecting);
    });
  });
  ambientElements.forEach((element) => ambientObserver.observe(element));
  return {
    revert() {
      observer.disconnect();
      ambientObserver.disconnect();
      window.removeEventListener("scroll", scroll);
      tweens.forEach((tween) => tween.cancel());
      elements.forEach((element) => delete element.dataset.enterDirection);
      ambientElements.forEach((element) => delete element.dataset.inView);
    },
  };
}
