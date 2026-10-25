import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/site/Layout";
import { collections } from "@/data/catalog";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — Kalavruti" },
      { name: "description", content: "The Earth Collection, The Indigo Story, Threads of Heritage and The Festive Edit." },
      { property: "og:title", content: "Collections — Kalavruti" },
      { property: "og:description", content: "Four stories told in fabric, colour and craft." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Collections,
});

function Collections() {
  return (
    <Page>
      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-[1500px]">
          <p className="eyebrow text-accent">Four Stories</p>
          <h1 className="mt-4 text-5xl md:text-7xl">Collections</h1>
          <div className="mt-16 space-y-24">
            {collections.map((c, i) => (
              <Link key={c.slug} to="/collections/$slug" params={{ slug: c.slug }}
                className={`reveal group grid items-center gap-10 md:grid-cols-2 ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
                </div>
                <div className="md:px-12">
                  <p className="eyebrow text-muted-foreground">Collection 0{i + 1}</p>
                  <h2 className="mt-4 text-4xl md:text-6xl">{c.name}</h2>
                  <p className="mt-6 max-w-md text-muted-foreground">{c.description}</p>
                  <span className="eyebrow mt-8 inline-block border-b border-foreground pb-1">Explore</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}
