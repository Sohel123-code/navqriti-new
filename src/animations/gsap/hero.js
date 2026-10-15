// Compositor animations keep the entrance progressing during WebGL compilation.
// The DOM itself is always visible: cancelled or delayed effects cannot hide it.
export function animateHero(scope) {
  const animations = [];
  let visible = false;
  const play = () => {
    animations.forEach((animation) => animation.cancel());
    animations.length = 0;
    const groups = [
      ["[data-hero-line]", 24, 600, 45],
      ["[data-hero-fade]", 12, 500, 30],
      ["[data-hero-visual]", 14, 650, 0],
    ];
    groups.forEach(([selector, distance, duration, stagger]) => {
      scope.querySelectorAll(selector).forEach((element, index) => {
        animations.push(
          element.animate(
            [
              { opacity: 0, transform: `translateY(${distance}px)` },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration,
              delay: index * stagger,
              easing: "cubic-bezier(.22,1,.36,1)",
              fill: "backwards",
            },
          ),
        );
      });
    });
  };
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !visible) play();
    visible = entry.isIntersecting;
  });
  observer.observe(scope);
  return {
    revert() {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    },
  };
}
