import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { collections, images, products } from "@/data/catalog";
import { loadGsap, useReducedMotion } from "./useMotionPrefs";

/* ---------- Depth-based collection cards ---------- */
function DepthCard({ c, i }: { c: (typeof collections)[number]; i: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (e: MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.setProperty("--dx", `${((e.clientX - r.left) / r.width - 0.5) * 2}`);
    ref.current!.style.setProperty("--dy", `${((e.clientY - r.top) / r.height - 0.5) * 2}`);
  };
  const leave = () => { ref.current!.style.setProperty("--dx", "0"); ref.current!.style.setProperty("--dy", "0"); };
  const layer = (d: number) => ({ transform: `translate3d(calc(var(--dx,0) * ${d}px), calc(var(--dy,0) * ${d}px), 0)`, transition: "transform .9s cubic-bezier(.2,.7,.2,1)" });
  return (
    <Link ref={ref} to="/collections/$slug" params={{ slug: c.slug }} onMouseMove={move} onMouseLeave={leave}
      className={`reveal group relative block ${i % 2 ? "md:mt-24" : ""}`}>
      <div className="relative aspect-[3/4] overflow-hidden bg-card">
        <img src={i % 2 ? images.dupatta : images.mirror} alt="" aria-hidden className="absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)] object-cover opacity-50" style={layer(-4)} />
        <div className="absolute inset-5 overflow-hidden shadow-2xl" style={layer(-10)}>
          <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full scale-110 object-cover transition-transform duration-[1.6s] group-hover:scale-100" />
        </div>
        <div className="absolute inset-x-8 bottom-8 text-primary-foreground" style={layer(16)}>
          <p className="eyebrow opacity-80">0{i + 1}</p>
          <h3 className="mt-1 text-3xl drop-shadow">{c.name}</h3>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{c.tagline}</p>
    </Link>
  );
}

export function DepthCollections() {
  return (
    <section className="px-6 py-28 md:px-10">
      <div className="mx-auto mb-12 flex max-w-[1500px] items-end justify-between">
        <h2 className="v-skew reveal text-4xl md:text-6xl">Shop by Collection</h2>
        <Link to="/collections" className="eyebrow border-b border-foreground pb-1">View all</Link>
      </div>
      <div className="mx-auto grid max-w-[1500px] gap-6 sm:grid-cols-2 md:grid-cols-4">
        {collections.map((c, i) => <DepthCard key={c.slug} c={c} i={i} />)}
      </div>
    </section>
  );
}

/* ---------- Horizontal scroll lookbook ---------- */
const look = [
  { src: products[1]!.images[0]!, w: "w-[70vw] md:w-[34vw]", h: "h-[70vh]", cap: "Aabha — Kesari" },
  { src: images.mirror, w: "w-[55vw] md:w-[22vw]", h: "h-[42vh] self-end", cap: "Mirror work" },
  { src: images.night, w: "w-[80vw] md:w-[40vw]", h: "h-[55vh]", cap: "The Garba circle" },
  { src: products[7]!.images[0]!, w: "w-[60vw] md:w-[26vw]", h: "h-[64vh] self-end", cap: "Navya — Yellow" },
  { src: images.dupatta, w: "w-[65vw] md:w-[30vw]", h: "h-[46vh]", cap: "The dupatta in motion" },
  { src: products[3]!.images[0]!, w: "w-[85vw] md:w-[46vw]", h: "h-[72vh]", cap: "Noor — Dandiya night" },
];

export function HorizontalLookbook() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [dist, setDist] = useState(0);
  // CSS sticky instead of a GSAP pin: the section's height equals the sideways distance,
  // so nothing below shifts when triggers re-measure.
  useEffect(() => {
    if (reduced || !track.current) return;
    const measure = () => setDist(Math.max(0, track.current!.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [reduced]);
  useEffect(() => {
    if (reduced || !dist || !root.current || !track.current) return;
    let ctx: { revert: () => void } | undefined;
    loadGsap().then(({ gsap }) => {
      ctx = gsap.context(() => {
        const st = { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true };
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: st });
        tl.fromTo(track.current, { x: 0 }, { x: () => -dist, duration: 1 }, 0)
          .fromTo(".lb-type", { xPercent: 0 }, { xPercent: -30, duration: 1 }, 0)
          .fromTo(".lb-img", { xPercent: -8 }, { xPercent: 8, duration: 1 }, 0);
      }, root.current!);
    });
    return () => ctx?.revert();
  }, [reduced, dist]);

  return (
    <section ref={root} className="relative bg-night text-primary-foreground" style={reduced ? undefined : { height: `calc(100svh + ${dist}px)` }}>
      <div className={`${reduced ? "" : "sticky top-0"} flex h-[100svh] items-center overflow-hidden`}>
        <p className="lb-type pointer-events-none absolute left-[10vw] top-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-[22vw] leading-none text-primary-foreground/10">Move · Spin · Celebrate</p>
        <div ref={track} className={`relative flex h-[78vh] items-start gap-[4vw] px-[8vw] ${reduced ? "overflow-x-auto" : ""}`}>
          <div className="flex w-[70vw] shrink-0 flex-col justify-center md:w-[26vw]">
            <p className="eyebrow text-gold">The Garba Lookbook</p>
            <h2 className="mt-5 text-5xl md:text-7xl">Made for the circle</h2>
            <p className="mt-6 max-w-xs text-primary-foreground/70">Lanterns, dhol, and skirts that open with every turn.</p>
          </div>
          {look.map((l) => (
            <figure key={l.cap} className={`flex shrink-0 flex-col ${l.w} ${l.h}`}>
              <div className="relative flex-1 overflow-hidden">
                <img src={l.src} alt={l.cap} loading="lazy" className="lb-img absolute inset-y-0 -left-[10%] h-full w-[120%] max-w-none object-cover" />
              </div>
              <figcaption className="eyebrow mt-3 text-primary-foreground/60">{l.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Large text mask ---------- */
export function TextMask({ word = "GARBA", src = images.hero }: { word?: string; src?: string }) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !root.current) return;
    let ctx: { revert: () => void } | undefined;
    loadGsap().then(({ gsap }) => {
      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.8 } });
        tl.fromTo(".tm-word", { scale: 1 }, { scale: 28, duration: 0.6, ease: "power2.in" }, 0.2)
          .fromTo(".tm-full", { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0.68)
          .fromTo(".tm-copy", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.1 }, 0.82);
      }, root.current!);
    });
    return () => ctx?.revert();
  }, [reduced]);
  return (
    <section ref={root} className={reduced ? "relative" : "relative h-[300vh]"}>
      <div className={`${reduced ? "h-[80vh]" : "sticky top-0 h-[100svh]"} flex items-center justify-center overflow-hidden bg-background`}>
        <h2 className="tm-word select-none bg-cover bg-center bg-clip-text font-serif text-[26vw] font-medium leading-none text-transparent" style={{ backgroundImage: `url(${src})`, transformOrigin: "50% 55%" }}>
          {word}
        </h2>
        <div className="tm-full absolute inset-0 opacity-0">
          <img src={src} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-primary/35" />
        </div>
        <div className="tm-copy absolute inset-x-0 bottom-20 px-6 text-center text-primary-foreground opacity-0">
          <p className="eyebrow opacity-80">Navratri nights</p>
          <p className="mx-auto mt-4 max-w-2xl font-serif text-3xl italic md:text-5xl">Lights. Music. Colour. Movement.</p>
          <Link to="/shop" className="eyebrow mt-8 inline-block border-b border-primary-foreground pb-1">Shop the collection</Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Scroll velocity skew ---------- */
export function VelocitySkew() {
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    let st: { kill: () => void } | undefined;
    let reset: { kill: () => void } | undefined;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      const setters = gsap.utils.toArray<HTMLElement>(".v-skew").map((el) => gsap.quickTo(el, "skewY", { duration: 0.6, ease: "power3.out" }));
      const clamp = gsap.utils.clamp(-4, 4);
      st = ScrollTrigger.create({
        onUpdate: (self) => {
          const v = clamp(self.getVelocity() / -400);
          setters.forEach((s) => s(v));
          reset?.kill();
          reset = gsap.delayedCall(0.12, () => setters.forEach((s) => s(0)));
        },
      });
    });
    return () => { st?.kill(); reset?.kill(); };
  }, [reduced]);
  return null;
}
