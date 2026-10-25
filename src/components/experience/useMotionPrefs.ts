import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const on = () => setR(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return r;
}

let refreshTimer: ReturnType<typeof setTimeout> | undefined;
let setup = false;

export async function loadGsap() {
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  gsap.registerPlugin(ScrollTrigger);
  const refresh = () => {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
  };
  if (!setup) {
    setup = true;
    // Mobile URL-bar show/hide must not re-measure (causes jumps); real resizes still refresh.
    ScrollTrigger.config({ ignoreMobileResize: true });
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);
    // Late-loading lazy images change section heights — re-measure once each settles.
    document.addEventListener("load", (e) => { if ((e.target as HTMLElement)?.tagName === "IMG") refresh(); }, true);
  }
  // Sections register asynchronously; re-measure once all have set up.
  refresh();
  return { gsap, ScrollTrigger };
}
