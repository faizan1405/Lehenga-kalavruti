import { useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import type { Product } from "@/data/catalog";

/* ---------- Cursor magnifier on product imagery ---------- */
export function Magnifier({ src, alt, onOpen }: { src: string; alt: string; onOpen: () => void }) {
  const [lens, setLens] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setLens({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height });
  };
  const Z = 2.8, D = 220;
  return (
    <div className="relative cursor-none overflow-hidden bg-muted md:cursor-none" onPointerMove={move} onPointerLeave={() => setLens(null)}>
      <img src={src} alt={alt} className="aspect-[3/4] w-full animate-rise object-cover" />
      {lens && (
        <div className="pointer-events-none absolute rounded-full border border-background/80 shadow-2xl"
          style={{
            width: D, height: D, left: lens.x - D / 2, top: lens.y - D / 2,
            backgroundImage: `url(${src})`, backgroundRepeat: "no-repeat",
            backgroundSize: `${lens.w * Z}px ${lens.h * Z}px`,
            backgroundPosition: `${-(lens.x * Z - D / 2)}px ${-(lens.y * Z - D / 2)}px`,
          }} />
      )}
      <button onClick={onOpen} className="eyebrow absolute bottom-4 right-4 bg-background/90 px-4 py-2.5 text-foreground backdrop-blur transition-colors hover:bg-background">
        View in detail
      </button>
    </div>
  );
}

/* ---------- Full-screen detail viewer: drag to rotate, scroll to zoom ---------- */
const markers = [
  { x: 50, y: 28, label: "Blouse Detail", key: "Texture" },
  { x: 40, y: 58, label: "Mirror Work", key: "Technique" },
  { x: 60, y: 42, label: "Waist & Flare", key: "Drape" },
  { x: 48, y: 82, label: "Lehenga Border", key: "Finish" },
];

export function DetailViewer({ p, start, onClose }: { p: Product; start: number; onClose: () => void }) {
  const [frame, setFrame] = useState(start);
  const [zoom, setZoom] = useState(1);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState(0);
  const [marker, setMarker] = useState<number | null>(null);
  const drag = useRef<{ x: number; acc: number } | null>(null);
  const n = p.images.length;

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setFrame((f) => (f + 1) % n);
      if (e.key === "ArrowLeft") setFrame((f) => (f - 1 + n) % n);
    };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [n, onClose]);

  const down = (e: PointerEvent<HTMLDivElement>) => { drag.current = { x: e.clientX, acc: 0 }; e.currentTarget.setPointerCapture(e.pointerId); };
  const moveDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    drag.current.x = e.clientX;
    if (zoom > 1) {
      const r = e.currentTarget.getBoundingClientRect();
      setOrigin((o) => ({ x: Math.min(100, Math.max(0, o.x - (dx / r.width) * 60)), y: o.y }));
      return;
    }
    drag.current.acc += dx;
    setTilt(Math.max(-14, Math.min(14, drag.current.acc / 6)));
    if (Math.abs(drag.current.acc) > 110) {
      setFrame((f) => (f + (drag.current!.acc < 0 ? 1 : -1) + n) % n);
      drag.current.acc = 0;
    }
  };
  const up = () => { drag.current = null; setTilt(0); };
  const wheel = (e: WheelEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
    setZoom((z) => Math.min(4, Math.max(1, z - e.deltaY * 0.0025)));
  };
  const reset = () => { setZoom(1); setOrigin({ x: 50, y: 50 }); setTilt(0); setFrame(start); setMarker(null); };
  const detail = marker !== null ? markers[marker]! : null;

  return (
    <div role="dialog" aria-modal="true" aria-label={`${p.name} detail view`} className="fixed inset-0 z-[100] flex animate-rise flex-col bg-primary text-primary-foreground">
      <div className="flex h-16 items-center justify-between px-6 md:px-10">
        <p className="eyebrow opacity-70">{p.name} — View in detail</p>
        <button onClick={onClose} className="eyebrow">Close</button>
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden [perspective:1600px]">
        <div className="relative h-[78vh] touch-none select-none overflow-hidden" style={{ aspectRatio: "3/4", cursor: zoom > 1 ? "grab" : "ew-resize", transform: `rotateY(${tilt}deg)`, transition: drag.current ? "none" : "transform .8s cubic-bezier(.2,.7,.2,1)" }}
          onPointerDown={down} onPointerMove={moveDrag} onPointerUp={up} onPointerCancel={up} onWheel={wheel}>
          {p.images.map((src, i) => (
            <img key={i} src={src} alt="" draggable={false}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
              style={{ opacity: i === frame ? 1 : 0, transform: `scale(${zoom})`, transformOrigin: `${origin.x}% ${origin.y}%`, transition: "opacity .5s, transform .35s ease-out" }} />
          ))}
          {zoom === 1 && frame === 0 && markers.map((m, i) => (
            <button key={m.label} onClick={(e) => { e.stopPropagation(); setMarker(i); setOrigin({ x: m.x, y: m.y }); setZoom(2.4); }}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={m.label}
              className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${m.x}%`, top: `${m.y}%` }}>
              <span className="block h-4 w-4 rounded-full border border-primary-foreground bg-primary-foreground/30 shadow-lg transition-transform group-hover:scale-125" />
              <span className="absolute inset-0 animate-ping rounded-full border border-primary-foreground/60" />
            </button>
          ))}
        </div>
        {detail && (
          <div className="absolute bottom-24 right-6 w-72 animate-rise bg-background p-6 text-foreground shadow-2xl md:right-16 md:top-1/3 md:bottom-auto">
            <p className="eyebrow text-accent">Detail</p>
            <h3 className="mt-3 text-3xl">{detail.label}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{p.details.find((d) => d.label === detail.key)?.value ?? ""}</p>
            <button onClick={reset} className="eyebrow mt-5 border-b border-foreground pb-1">Back to full view</button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6 px-6 py-6 text-primary-foreground/80">
        <span className="eyebrow hidden md:inline">Drag to rotate</span>
        <span className="eyebrow hidden md:inline">Scroll to zoom</span>
        <button className="eyebrow md:hidden" onClick={() => setFrame((f) => (f - 1 + n) % n)}>Prev</button>
        <button className="eyebrow md:hidden" onClick={() => setFrame((f) => (f + 1) % n)}>Next</button>
        <button className="eyebrow" onClick={() => setZoom((z) => Math.min(4, z + 0.6))}>Zoom +</button>
        <button className="eyebrow" onClick={() => setZoom((z) => Math.max(1, z - 0.6))}>Zoom −</button>
        <button className="eyebrow border border-primary-foreground/40 px-4 py-2" onClick={reset}>Reset view</button>
        <span className="eyebrow opacity-50">{frame + 1} / {n}</span>
      </div>
    </div>
  );
}
