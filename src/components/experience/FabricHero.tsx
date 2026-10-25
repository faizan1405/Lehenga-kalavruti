import { ClientOnly, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { images } from "@/data/catalog";
import { loadGsap, useReducedMotion } from "./useMotionPrefs";
import type { SceneState } from "./FabricScene";

const FabricScene = lazy(() => import("./FabricScene"));

const captions = ["Mirror. Thread. Light.", "The lehenga takes shape", "Every turn opens the flare", "One full Garba spin"];

/** Signature hero — "The Garba Spin". Scroll-scrubbed; static fallback for reduced motion. */
export function FabricHero() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const state = useRef<SceneState>({ p: 0, mx: 0, my: 0 });
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (reduced || !root.current) return;
    const el = root.current;
    let ctx: { revert: () => void } | undefined;
    loadGsap().then(({ gsap }) => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 } });
        tl.to(state.current, { p: 1, duration: 1 }, 0)
          .to(".h-intro", { opacity: 0, y: -30, duration: 0.06 }, 0.08);
        captions.forEach((_, i) => {
          const s = 0.16 + i * 0.13;
          tl.fromTo(`.hc-${i}`, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.04 }, s).to(`.hc-${i}`, { opacity: 0, y: -30, duration: 0.04 }, s + 0.09);
        });
        tl.fromTo(".h-title", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.08 }, 0.72)
          .fromTo(".h-reveal", { clipPath: "circle(0% at 50% 55%)" }, { clipPath: "circle(75% at 50% 55%)", duration: 0.12, ease: "power2.in" }, 0.88);
      }, el);
    });
    const io = new IntersectionObserver(([e]) => setActive(!!e?.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    const mm = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      state.current.mx = (e.clientX / window.innerWidth) * 2 - 1;
      state.current.my = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", mm);
    return () => { ctx?.revert(); io.disconnect(); window.removeEventListener("pointermove", mm); };
  }, [reduced]);

  const Cta = () => (
    <div className="mt-10 flex flex-wrap justify-center gap-4">
      <Link to="/shop" className="eyebrow pointer-events-auto bg-accent px-7 py-4 text-accent-foreground">Shop the collection</Link>
      <Link to="/collections/$slug" params={{ slug: "the-garba-edit" }} className="eyebrow pointer-events-auto border border-primary-foreground/50 px-7 py-4">The Garba Edit</Link>
    </div>
  );

  if (reduced) {
    return (
      <section className="relative h-screen overflow-hidden bg-night">
        <img src={images.hero} alt="Lehenga mid Garba spin" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-night/50" />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-primary-foreground">
          <p className="eyebrow text-gold">Navratri 2026</p>
          <h1 className="mt-6 text-6xl leading-none md:text-8xl">Spin into the celebration.</h1>
          <Cta />
        </div>
      </section>
    );
  }

  return (
    <section ref={root} className="relative h-[650vh] bg-night">
      <div className="sticky top-0 h-[100svh] overflow-hidden text-primary-foreground">
        <div className="pointer-events-none absolute inset-0 touch-pan-y">
          <ClientOnly fallback={<div className="h-full w-full bg-night" />}>
            <Suspense fallback={<div className="h-full w-full bg-night" />}>
              <FabricScene state={state} active={active} />
            </Suspense>
          </ClientOnly>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-night)_100%)]" />

        <div className="h-intro pointer-events-none absolute inset-x-0 bottom-[16vh] text-center">
          <p className="font-serif text-3xl tracking-[0.4em]">KALAVRUTI</p>
          <p className="eyebrow mt-4 text-gold">Crafted for the celebration</p>
        </div>

        {captions.map((c, i) => (
          <div key={c} className={`hc-${i} pointer-events-none absolute bottom-[14vh] left-6 opacity-0 md:left-16`}>
            <p className="eyebrow text-gold">0{i + 1} / 04</p>
            <p className="mt-3 font-serif text-4xl italic md:text-6xl">{c}</p>
          </div>
        ))}

        <div className="h-title pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0">
          <p className="eyebrow text-gold">Navratri 2026</p>
          <h1 className="mt-6 text-6xl leading-[0.95] md:text-9xl">Spin into<br />the celebration.</h1>
          <Cta />
        </div>

        <div className="h-reveal absolute inset-0" style={{ clipPath: "circle(0% at 50% 55%)" }}>
          <img src={images.hero} alt="Rani pink lehenga mid Garba spin" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-night/30" />
          <div className="absolute inset-x-0 bottom-14 flex flex-col items-center px-6 text-center">
            <p className="eyebrow text-gold">The new Navratri collection</p>
            <p className="mt-4 font-serif text-4xl md:text-7xl">Made for nine nights of colour</p>
            <Cta />
          </div>
        </div>

        <div className="h-intro eyebrow absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-foreground/60">Scroll to spin</div>
      </div>
    </section>
  );
}
