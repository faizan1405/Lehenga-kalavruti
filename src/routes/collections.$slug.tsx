import { createFileRoute, notFound } from "@tanstack/react-router";
import { Page } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { getCollection, products } from "@/data/catalog";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const c = getCollection(params.slug);
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Collection"} — Kalavruti` },
      { name: "description", content: loaderData?.description ?? "" },
      { property: "og:title", content: `${loaderData?.name ?? "Collection"} — Kalavruti` },
      { property: "og:description", content: loaderData?.description ?? "" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const c = Route.useLoaderData();
  const items = products.filter((p) => p.collection === c.slug);
  return (
    <Page overlay>
      <section className="relative h-[85vh] overflow-hidden bg-primary">
        <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full animate-slow-zoom object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-primary/10" />
        <div className="relative flex h-full flex-col justify-end px-6 pb-16 text-primary-foreground md:px-16">
          <p className="eyebrow opacity-70">{c.tagline}</p>
          <h1 className="mt-4 text-5xl md:text-8xl">{c.name}</h1>
          <p className="mt-6 max-w-lg opacity-85">{c.description}</p>
        </div>
      </section>
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4">
          {items.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </section>
    </Page>
  );
}
