import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/site/Layout";
import { journal } from "@/data/catalog";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Kalavruti" },
      { name: "description", content: "Notes on colour, craft and the making of each Kalavruti collection." },
      { property: "og:title", content: "Journal — Kalavruti" },
      { property: "og:description", content: "Notes on colour, craft and making." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Journal,
});

function Journal() {
  const first = journal[0]!;
  const rest = journal.slice(1);
  return (
    <Page>
      <section className="mx-auto max-w-[1500px] px-6 py-20 md:px-10">
        <p className="eyebrow text-accent">Stories</p>
        <h1 className="mt-4 text-5xl md:text-7xl">Journal</h1>
        <article className="reveal mt-16 grid items-center gap-10 md:grid-cols-2">
          <img src={first.image} alt={first.title} className="aspect-[4/3] w-full object-cover" />
          <div>
            <p className="eyebrow text-muted-foreground">{first.date}</p>
            <h2 className="mt-4 text-4xl md:text-6xl">{first.title}</h2>
            <p className="mt-6 max-w-md text-muted-foreground">{first.excerpt}</p>
          </div>
        </article>
        <div className="mt-24 grid gap-10 md:grid-cols-2">
          {rest.map((j) => (
            <article key={j.slug} className="reveal">
              <img src={j.image} alt={j.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <p className="eyebrow mt-5 text-muted-foreground">{j.date}</p>
              <h3 className="mt-2 text-3xl">{j.title}</h3>
              <p className="mt-2 text-muted-foreground">{j.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </Page>
  );
}
