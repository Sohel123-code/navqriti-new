import { useEffect } from "react";
import Lenis from "lenis";
import useMediaQuery from "./useMediaQuery";

export default function useLenis(motionEnabled, pathname) {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  useEffect(() => {
    // Phones keep native momentum scrolling. Smooth wheel motion is desktop-only.
    const lenis = motionEnabled && finePointer ? new Lenis({
      duration: 1.05,
      smoothWheel: true,
      anchors: { offset: -85 },
    }) : null;
    const root = document.documentElement;
    const body = document.body;
    let restore = null;
    const viewport = () => {
      root.style.setProperty("--dialog-viewport-height", `${window.visualViewport?.height ?? window.innerHeight}px`);
      root.style.setProperty("--dialog-viewport-top", `${window.visualViewport?.offsetTop ?? 0}px`);
    };
    const syncDialog = (opening = false) => {
      const open = opening || Boolean(document.querySelector("dialog[open]"));
      if (open && !restore) {
        const y = window.scrollY;
        const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: root.style.overflow };
        lenis?.stop();
        root.style.overflow = "hidden";
        Object.assign(body.style, { position: "fixed", top: `-${y}px`, width: "100%" });
        viewport();
        restore = () => {
          Object.assign(body.style, { position: previous.position, top: previous.top, width: previous.width });
          root.style.overflow = previous.overflow;
          window.scrollTo({ top: y, behavior: "instant" });
          lenis?.start();
          lenis?.resize();
          lenis?.scrollTo(y, { immediate: true, force: true });
        };
      } else if (!open && restore) {
        restore(); restore = null;
      }
    };
    // Lock before showModal focuses its first control and can move the viewport.
    const opening = () => syncDialog(true);
    document.addEventListener("navqriti:dialog-opening", opening);
    const dialogs = new MutationObserver(() => syncDialog());
    dialogs.observe(body, { subtree: true, attributes: true, attributeFilter: ["open"] });
    window.visualViewport?.addEventListener("resize", viewport);
    window.visualViewport?.addEventListener("scroll", viewport);
    const routePosition = event => { lenis?.resize(); lenis?.scrollTo(event.detail, { immediate: true, force: true }); };
    document.addEventListener("navqriti:route-position", routePosition);
    syncDialog();
    let frame;
    const tick = (time) => {
      lenis?.raf(time);
      frame = requestAnimationFrame(tick);
    };
    if (lenis) frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      dialogs.disconnect();
      document.removeEventListener("navqriti:dialog-opening", opening);
      restore?.();
      window.visualViewport?.removeEventListener("resize", viewport);
      window.visualViewport?.removeEventListener("scroll", viewport);
      root.style.removeProperty("--dialog-viewport-height");
      root.style.removeProperty("--dialog-viewport-top");
      document.removeEventListener("navqriti:route-position", routePosition);
      lenis?.destroy();
    };
  }, [motionEnabled, finePointer, pathname]);
}
