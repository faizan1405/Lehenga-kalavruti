import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { byColour, colours, formatPrice, images, occasions, products } from "@/data/catalog";
import { loadGsap, useReducedMotion } from "./useMotionPrefs";

type Ctx = { revert: () => void } | undefined;
function usePinned(build: (gsap: typeof import("gsap").gsap, el: HTMLElement) => void, deps: unknown[] = []) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || !ref.current) return;
    const el = ref.current;
    let ctx: Ctx;
    loadGsap().then(({ gsap }) => { ctx = gsap.context(() => build(gsap, el), el); });
    return () => ctx?.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, ...deps]);
  return { ref, reduced };
}

/* ---------- Shop by Colour ---------- */
export function ShopByColour() {
  const [hover, setHover] = useState<string>("Rani Pink");
  const p = byColour(hover);
  return (
    <section className="px-6 py-28 md:px-10">
      <div className="mx-auto grid max-w-[1500px] items-center gap-12 md:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow text-accent">Shop by Colour</p>
          <h2 className="mt-4 text-5xl md:text-7xl">Find your colour<br />for the night.</h2>
          <div className="mt-12 flex flex-wrap gap-5">
            {colours.map((c) => {
              const prod = byColour(c.name);
              const inner = (
                <>
                  <span className={`block h-14 w-14 rounded-full ring-offset-4 ring-offset-background transition-all ${hover === c.name ? "scale-110 ring-2 ring-foreground" : ""}`} style={{ background: c.hex }} />
                  <span className="eyebrow mt-3 block text-center text-[0.6rem]">{c.name}</span>
                </>
              );
              return prod ? (
                <Link key={c.name} to="/product/$slug" params={{ slug: prod.slug }} onMouseEnter={() => setHover(c.name)} onFocus={() => setHover(c.name)} className="w-20">{inner}</Link>
              ) : (
                <span key={c.name} className="w-20 opacity-50">{inner}</span>
              );
            })}
          </div>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden bg-night">
          {products.map((x) => (
            <img key={x.slug} src={x.images[0]} alt={`${x.name} lehenga in ${x.colour}`} loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${p?.slug === x.slug ? "scale-100 opacity-100" : "scale-105 opacity-0"}`} />
          ))}
          {p && (
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-night/80 to-transparent p-8 text-primary-foreground">
              <div><p className="eyebrow text-gold">{p.colour}</p><p className="mt-2 font-serif text-4xl">{p.name}</p></div>
              <p>{formatPrice(p.price)}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------- Look Closer: pinned macro pan ---------- */
const stops = [
  { t: "Blouse detail", c: "Mirror-studded bodice with thread embroidery.", x: 0, y: 32, s: 2.6 },
  { t: "Mirror work", c: "Small mirrors set by hand to catch every light.", x: 10, y: 10, s: 2.8 },
  { t: "Embroidery", c: "Dense thread motifs across the skirt panels.", x: -12, y: -6, s: 2.4 },
  { t: "The border", c: "A wide hem border that weights the flare.", x: 0, y: -28, s: 2.2 },
];
export function LookCloser() {
  const { ref, reduced } = usePinned((gsap, el) => {
    const tl = gsap.timeline({ defaults: { ease: "power1.inOut" }, scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 } });
    tl.fromTo(".lc-img", { scale: 1, xPercent: 0, yPercent: 0 }, { scale: stops[0]!.s, xPercent: stops[0]!.x, yPercent: stops[0]!.y, duration: 1 });
    tl.to(".lc-intro", { opacity: 0, duration: 0.3 }, 0);
    stops.forEach((s, i) => {
      if (i) tl.to(".lc-img", { scale: s.s, xPercent: s.x, yPercent: s.y, duration: 1 });
      tl.fromTo(`.lc-${i}`, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, "<0.4").to(`.lc-${i}`, { opacity: 0, duration: 0.3 }, ">0.4");
    });
    tl.to(".lc-img", { scale: 1, xPercent: 0, yPercent: 0, duration: 1 }).fromTo(".lc-end", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "<0.5");
  });
  const prod = products[0]!;
  if (reduced) {
    return (
      <section className="grid gap-4 bg-night px-6 py-24 text-primary-foreground md:grid-cols-4 md:px-10">
        <h2 className="text-5xl md:col-span-4">Look closer.</h2>
        {[images.blouse, images.mirror, images.border, images.dupatta].map((s, i) => (
          <figure key={s}><img src={s} alt={stops[i]!.t} loading="lazy" className="aspect-square object-cover" /><figcaption className="eyebrow mt-3">{stops[i]!.t}</figcaption></figure>
        ))}
      </section>
    );
  }
  return (
    <section ref={ref} className="relative h-[600vh] bg-night">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden text-primary-foreground">
        <img src={prod.images[0]} alt={`${prod.name} lehenga`} loading="lazy" className="lc-img h-full w-auto max-w-none object-cover will-change-transform" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--color-night)_100%)]" />
        <div className="lc-intro absolute left-6 top-28 md:left-16"><p className="eyebrow text-gold">Look Closer</p><p className="mt-4 font-serif text-5xl md:text-7xl">Every detail,<br />up close.</p></div>
        {stops.map((s, i) => (
          <div key={s.t} className={`lc-${i} absolute bottom-[12vh] left-6 max-w-sm opacity-0 md:left-16`}>
            <p className="eyebrow text-gold">0{i + 1} — {s.t}</p>
            <p className="mt-3 font-serif text-3xl italic md:text-4xl">{s.c}</p>
          </div>
        ))}
        <div className="lc-end absolute bottom-[10vh] text-center opacity-0">
          <p className="font-serif text-4xl">{prod.name} · {formatPrice(prod.price)}</p>
          <Link to="/product/$slug" params={{ slug: prod.slug }} className="eyebrow mt-6 inline-block bg-accent px-7 py-4 text-accent-foreground">View the lehenga</Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Lehenga Movement: pinned image, scroll steps ---------- */
const moves = [
  { t: "The Flare", c: "Up to eight metres of fabric, cut to open in a full circle." },
  { t: "The Kalis", c: "Panels stitched so the skirt fans out evenly as you turn." },
  { t: "The Border", c: "A weighted hem that keeps the shape mid-spin." },
  { t: "The Dupatta", c: "Light net that floats behind every step." },
  { t: "The Finish", c: "Soft lining and an adjustable waist for nights of dancing." },
];
export function LehengaMovement() {
  const prod = products[1]!;
  const { ref, reduced } = usePinned((gsap, el) => {
    // One timeline drives the image so steps never fight over the same properties when reversing.
    const steps = gsap.utils.toArray<HTMLElement>(".mv-step");
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 } });
    steps.forEach((_, i) => tl.to(".mv-img", { scale: 1 + (i + 1) * 0.08, rotate: i % 2 ? -2 : 2, duration: 1 }));
    steps.forEach((s) => gsap.fromTo(s, { opacity: 0.25 }, { opacity: 1, ease: "none", scrollTrigger: { trigger: s, start: "top 70%", end: "top 40%", scrub: true } }));
    gsap.fromTo(".mv-bar", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top center", end: "bottom center", scrub: true } });
  });
  return (
    <section ref={ref} className="relative px-6 py-24 md:px-10">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-2">
        <div className={reduced ? "" : "md:sticky md:top-0 md:h-[100svh] md:py-16"}>
          <div className="h-[70vh] overflow-hidden bg-night md:h-full">
            <img src={prod.images[0]} alt={`${prod.name} lehenga mid-spin`} loading="lazy" className="mv-img h-full w-full object-cover" />
          </div>
        </div>
        <div className="relative">
          <span className="mv-bar absolute left-0 top-0 h-full w-px origin-top bg-accent" />
          <div className="pl-8 pt-[20vh]">
            <p className="eyebrow text-accent">The Garba Edit — {prod.name}</p>
            <h2 className="mt-4 text-5xl md:text-7xl">Made to move.</h2>
          </div>
          {moves.map((m, i) => (
            <div key={m.t} className="mv-step flex min-h-[60vh] flex-col justify-center pl-8">
              <p className="eyebrow text-muted-foreground">0{i + 1}</p>
              <h3 className="mt-3 text-4xl md:text-5xl">{m.t}</h3>
              <p className="mt-4 max-w-sm text-muted-foreground">{m.c}</p>
            </div>
          ))}
          <div className="pb-[20vh] pl-8">
            <Link to="/product/$slug" params={{ slug: prod.slug }} className="eyebrow inline-block bg-primary px-7 py-4 text-primary-foreground">Shop {prod.name} — {formatPrice(prod.price)}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- The Nine Nights ---------- */
const nights = ["Rani Pink", "Kesari", "Emerald", "Indigo", "Maroon", "Purple", "Turquoise", "Yellow", "Ivory"];
export function NineNights() {
  const { ref, reduced } = usePinned((gsap, el) => {
    const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 } });
    nights.forEach((n, i) => {
      const hex = colours.find((c) => c.name === n)!.hex;
      if (i) tl.to(".nn-bg", { backgroundColor: hex, duration: 1 }, i);
      tl.fromTo(`.nn-${i}`, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.5 }, i).to(`.nn-${i}`, { opacity: 0, duration: 0.4 }, i + 0.7);
    });
  });
  const items = nights.map((n) => byColour(n)!);
  if (reduced) {
    return (
      <section className="grid grid-cols-3 gap-2 bg-night p-6 md:grid-cols-9">
        {items.map((p, i) => <Link key={p.slug} to="/product/$slug" params={{ slug: p.slug }}><img src={p.images[0]} alt={p.name} loading="lazy" className="aspect-[3/4] object-cover" /><p className="eyebrow mt-2 text-primary-foreground">Night {i + 1}</p></Link>)}
      </section>
    );
  }
  return (
    <section ref={ref} className="relative h-[900vh]">
      <div className="nn-bg sticky top-0 h-[100svh] overflow-hidden text-primary-foreground" style={{ backgroundColor: colours[0].hex }}>
        <div className="absolute inset-0 bg-night/55" />
        <p className="eyebrow absolute left-6 top-28 text-gold md:left-16">The Nine Nights</p>
        {items.map((p, i) => (
          <div key={p.slug} className={`nn-${i} absolute inset-0 grid items-center gap-8 px-6 opacity-0 md:grid-cols-2 md:px-16`}>
            <div>
              <p className="font-serif text-[18vw] leading-none md:text-[12vw]">0{i + 1}</p>
              <p className="eyebrow mt-4">Night {i + 1} · {p.colour}</p>
              <p className="mt-3 font-serif text-4xl italic">{p.name} — {formatPrice(p.price)}</p>
              <Link to="/product/$slug" params={{ slug: p.slug }} className="eyebrow mt-8 inline-block border-b border-primary-foreground pb-1">Shop this colour</Link>
            </div>
            <img src={p.images[0]} alt={`${p.name} lehenga`} loading="lazy" className="mx-auto h-[70vh] w-auto object-cover shadow-2xl" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Garba Circle: 3D ring turned by scroll ---------- */
export function GarbaCircle() {
  const items = products.slice(0, 8);
  const { ref, reduced } = usePinned((gsap, el) => {
    gsap.fromTo(".gc-ring", { rotateY: 0 }, { rotateY: -360, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.8 } });
  });
  const step = 360 / items.length;
  return (
    <section ref={ref} className={reduced ? "bg-night py-20" : "relative h-[400vh] bg-night"}>
      <div className={`${reduced ? "" : "sticky top-0 h-[100svh]"} flex flex-col items-center justify-center overflow-hidden text-primary-foreground`}>
        <p className="relative z-10 eyebrow text-gold">The Garba Circle</p>
        <h2 className="relative z-10 mt-3 text-center text-4xl md:text-6xl">Every look, one circle.</h2>
        <div className="mt-16 h-[48vh] w-full [perspective:1600px]">
          <div className="gc-ring relative mx-auto h-full w-[22vh] [transform-style:preserve-3d]">
            {items.map((p, i) => (
              <Link key={p.slug} to="/product/$slug" params={{ slug: p.slug }} className="absolute inset-0 block [backface-visibility:hidden]"
                style={{ transform: `rotateY(${i * step}deg) translateZ(min(42vw, 46vh))` }}>
                <img src={p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                <p className="eyebrow mt-2 text-center">{p.name} · {formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Shop by Occasion ---------- */
export function ShopByOccasion() {
  return (
    <section className="px-6 py-24 md:px-10">
      <div className="mx-auto max-w-[1500px]">
        <p className="eyebrow text-accent">Shop by Occasion</p>
        <div className="mt-8 divide-y divide-border border-y border-border">
          {occasions.map((o) => {
            const p = products.find((x) => x.occasions.includes(o)) ?? products[0]!;
            return (
              <Link key={o} to="/shop" className="group relative flex items-center justify-between py-6">
                <span className="font-serif text-4xl transition-transform duration-500 group-hover:translate-x-4 md:text-6xl">{o}</span>
                <img src={p.images[0]} alt="" aria-hidden className="pointer-events-none absolute right-24 top-1/2 hidden h-40 w-32 -translate-y-1/2 rotate-3 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block" />
                <span className="eyebrow">Shop →</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Navratri Night with mirror-light cursor ---------- */
export function NavratriNight() {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    ref.current!.style.setProperty("--x", `${e.clientX - r.left}px`);
    ref.current!.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  return (
    <section>
      <div ref={ref} onPointerMove={move} onPointerLeave={() => { ref.current?.style.removeProperty("--x"); ref.current?.style.removeProperty("--y"); }} className="relative h-[90vh] overflow-hidden bg-night text-primary-foreground">
        <img src={images.night} alt="Garba night under festive lights" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(220px circle at var(--x,50%) var(--y,50%), color-mix(in oklab, var(--color-gold) 35%, transparent), transparent 70%)", mixBlendMode: "screen" }} />
        <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow text-gold">Navratri Night</p>
          <h2 className="mt-6 text-5xl md:text-8xl">Where colour<br />comes alive.</h2>
          <p className="mt-6 max-w-md text-primary-foreground/75">Mirror work was made for nights like this — move your cursor and watch it catch the light.</p>
          <Link to="/shop" className="eyebrow mt-10 bg-accent px-7 py-4 text-accent-foreground">Shop Navratri</Link>
        </div>
      </div>
    </section>
  );
}
