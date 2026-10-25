import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/site/Layout";
import { DetailViewer, Magnifier } from "@/components/experience/ProductViewer";
import { ProductCard } from "@/components/site/ProductCard";
import { formatPrice, getCollection, getProduct, products } from "@/data/catalog";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = getProduct(params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Piece"} ${loaderData?.type ?? ""} — Kalavruti` },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:title", content: `${loaderData?.name ?? "Piece"} — Kalavruti` },
      { property: "og:description", content: loaderData?.description ?? "" },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

const sizes = ["XS", "S", "M", "L", "XL", "XXL", "Custom"];

function ProductPage() {
  const p = Route.useLoaderData();
  const col = getCollection(p.collection);
  const [active, setActive] = useState(0);
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);
  const [viewer, setViewer] = useState(false);
  const [tab, setTab] = useState<"lehenga" | "blouse" | "dupatta">("lehenga");
  const related = products.filter((x) => x.slug !== p.slug).slice(0, 4);
  return (
    <Page>
      {viewer && <DetailViewer p={p} start={active} onClose={() => setViewer(false)} />}
      <section className="mx-auto grid max-w-[1500px] gap-10 px-6 py-12 md:grid-cols-12 md:px-10">
        <div className="flex gap-4 md:col-span-7">
          <div className="hidden flex-col gap-3 md:flex">
            {p.images.map((src, i) => (
              <button key={i} onClick={() => setActive(i)} className={`w-20 border ${i === active ? "border-foreground" : "border-transparent opacity-60"}`}>
                <img src={src} alt="" className="aspect-[3/4] w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1">
            <Magnifier key={active} src={p.images[active]!} alt={p.name} onOpen={() => setViewer(true)} />
          </div>
        </div>
        <div className="md:col-span-5 md:pt-10">
          {col && <Link to="/collections/$slug" params={{ slug: col.slug }} className="eyebrow text-accent">{col.name}</Link>}
          <h1 className="mt-4 text-6xl">{p.name}</h1>
          <p className="eyebrow mt-2 text-muted-foreground">{p.type} · Lehenga, blouse & dupatta</p>
          <p className="mt-6 text-xl">{formatPrice(p.price)}</p>
          <p className="mt-8 max-w-md font-serif text-2xl italic leading-snug text-muted-foreground">{p.description}</p>
          <div className="mt-10">
            <p className="eyebrow mb-3">Size</p>
            <div className="flex gap-2">
              {sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)}
                  className={`h-11 w-12 border text-sm transition-colors ${s === size ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}>{s}</button>
              ))}
            </div>
          </div>
          <button onClick={() => setAdded(true)} className="eyebrow mt-8 h-14 w-full bg-primary text-primary-foreground transition-opacity hover:opacity-90">
            {added ? "Added to bag" : "Add to bag"}
          </button>
          {size === "Custom" && <p className="mt-4 text-sm text-muted-foreground">Made to measure — we will contact you for your measurements after ordering.</p>}
          <a href={`https://wa.me/?text=${encodeURIComponent(`Hi Kalavruti, I'd like to know more about the ${p.name} lehenga.`)}`} target="_blank" rel="noreferrer" className="eyebrow mt-3 flex h-14 w-full items-center justify-center border border-foreground">Ask on WhatsApp</a>
          <p className="mt-4 text-sm text-muted-foreground">Colour: {p.colour} · {p.occasions.join(", ")} · {p.crafts.join(", ")}</p>
          <div className="mt-12 flex gap-6 border-b border-border">
            {(["lehenga", "blouse", "dupatta"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`eyebrow pb-3 ${tab === t ? "border-b-2 border-foreground" : "text-muted-foreground"}`}>{t}</button>
            ))}
          </div>
          <dl className="divide-y divide-border border-b border-border">
            {p[tab].map((d) => (
              <div key={d.label} className="flex justify-between py-4 text-sm">
                <dt className="eyebrow text-muted-foreground">{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 grid grid-cols-4 gap-2 md:hidden">
            {p.images.map((src, i) => (
              <button key={i} onClick={() => setActive(i)}><img src={src} alt="" className="aspect-[3/4] object-cover" /></button>
            ))}
          </div>
        </div>
      </section>
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1500px]">
          <h2 className="mb-12 text-4xl">You may also love</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4">
            {related.map((x) => <ProductCard key={x.slug} p={x} />)}
          </div>
        </div>
      </section>
    </Page>
  );
}
