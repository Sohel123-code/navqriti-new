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
    element.addEventListener("pointercancel", reset);
    const release = (event) => { if (event.pointerType === "touch") reset(); };
    element.addEventListener("pointerup", release);
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", reset);
      element.removeEventListener("pointercancel", reset);
      element.removeEventListener("pointerup", release);
      reset();
    };
  }, [elementRef, enabled]);
  return position;
}
