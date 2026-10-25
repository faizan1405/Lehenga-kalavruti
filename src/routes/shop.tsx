import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/data/catalog";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Kalavruti" },
      { name: "description", content: "Sarees, kurta sets, anarkalis and festive pieces from Kalavruti." },
      { property: "og:title", content: "Shop — Kalavruti" },
      { property: "og:description", content: "Sarees, kurta sets, anarkalis and festive pieces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  return (
    <Page>
      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-[1500px]">
          <p className="eyebrow text-accent">All Pieces</p>
          <h1 className="mt-4 text-5xl md:text-7xl">The Shop</h1>
          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4">
            {products.map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>
    </Page>
  );
}
