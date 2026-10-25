import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

const nav = [
  { to: "/shop", label: "Shop" },
  { to: "/collections", label: "Collections" },
  { to: "/craft", label: "Craft" },
  { to: "/journal", label: "Journal" },
] as const;

export function Header({ overlay = false }: { overlay?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  const solid = !overlay || scrolled || open;
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "border-b border-border bg-background/95 text-foreground backdrop-blur" : "text-background"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 md:px-10">
        <nav className="hidden gap-8 md:flex">
          {nav.slice(0, 2).map((n) => (
            <Link key={n.to} to={n.to} className="eyebrow opacity-80 transition-opacity hover:opacity-100">{n.label}</Link>
          ))}
        </nav>
        <button className="eyebrow md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? "Close" : "Menu"}
        </button>
        <Link to="/" className="font-serif text-2xl tracking-[0.35em] md:text-3xl">KALAVRUTI</Link>
        <nav className="hidden gap-8 md:flex">
          {nav.slice(2).map((n) => (
            <Link key={n.to} to={n.to} className="eyebrow opacity-80 transition-opacity hover:opacity-100">{n.label}</Link>
          ))}
        </nav>
        <span className="eyebrow md:hidden">Bag</span>
      </div>
      {open && (
        <nav className="flex flex-col gap-6 border-t border-border px-6 py-8 md:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="font-serif text-3xl">{n.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-6 py-20 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <p className="font-serif text-4xl tracking-[0.3em]">KALAVRUTI</p>
          <p className="mt-6 max-w-sm font-serif text-xl italic opacity-80">
            Clothing shaped by texture, memory and the quiet beauty of craft.
          </p>
        </div>
        <div className="space-y-3 text-sm opacity-80">
          <p className="eyebrow mb-5 opacity-60">Explore</p>
          <Link to="/shop" className="block">Shop</Link>
          <Link to="/collections" className="block">Collections</Link>
          <Link to="/craft" className="block">Craft</Link>
          <Link to="/journal" className="block">Journal</Link>
        </div>
        <div className="text-sm opacity-80">
          <p className="eyebrow mb-5 opacity-60">Letters</p>
          <p>Occasional notes on new collections and the craft behind them.</p>
          <form className="mt-5 flex border-b border-primary-foreground/40" onSubmit={(e) => e.preventDefault()}>
            <input placeholder="Your email" className="w-full bg-transparent py-2 outline-none placeholder:text-primary-foreground/50" />
            <button className="eyebrow">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 px-6 py-6 text-center text-xs opacity-50">© 2026 Kalavruti</div>
    </footer>
  );
}

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal:not(.is-visible)");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("is-visible"), io.unobserve(e.target))),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

export function Page({ children, overlay = false }: { children: ReactNode; overlay?: boolean }) {
  useReveal();
  return (
    <div className="min-h-screen bg-background">
      <Header overlay={overlay} />
      <main className={overlay ? "" : "pt-20"}>{children}</main>
      <Footer />
    </div>
  );
}
