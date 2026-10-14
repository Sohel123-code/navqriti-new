import { useEffect, useRef } from "react";

export default function useMousePosition(elementRef, enabled = true) {
  const position = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;
    const move = (event) => {
      const box = element.getBoundingClientRect();
      position.current = {
        x: ((event.clientX - box.left) / box.width) * 2 - 1,
        y: -((event.clientY - box.top) / box.height) * 2 + 1,
      };
    };
    const reset = () => {
      position.current = { x: 0, y: 0 };
    };
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", reset);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", reset);
      reset();
    };
  }, [elementRef, enabled]);
  return position;
}
