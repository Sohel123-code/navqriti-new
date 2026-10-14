import { useRef } from "react";
import Button from "./Button";
import { moveMagnet, resetMagnet } from "../../animations/gsap/magnetic";

export default function MagneticButton({ motionEnabled = true, ...props }) {
  const ref = useRef(null);
  return (
    <span
      className="magnetic-wrap"
      ref={ref}
      onPointerMove={(event) => {
        if (motionEnabled && event.pointerType === "mouse")
          moveMagnet(ref.current, event);
      }}
      onPointerLeave={() => resetMagnet(ref.current)}
    >
      <Button {...props} />
    </span>
  );
}
