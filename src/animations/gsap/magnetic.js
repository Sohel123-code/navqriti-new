import gsap from "gsap";
export function moveMagnet(element, event) {
  const rect = element.getBoundingClientRect();
  gsap.to(element, {
    x: (event.clientX - rect.left - rect.width / 2) * 0.12,
    y: (event.clientY - rect.top - rect.height / 2) * 0.2,
    duration: 0.4,
    overwrite: true,
  });
}
export function resetMagnet(element) {
  gsap.to(element, {
    x: 0,
    y: 0,
    duration: 0.7,
    ease: "elastic.out(1, 0.5)",
    overwrite: true,
  });
}
