import { createFileRoute } from "@tanstack/react-router";
import { Page } from "@/components/site/Layout";
import { images } from "@/data/catalog";

export const Route = createFileRoute("/craft")({
  head: () => ({
    meta: [
      { title: "The Craft — Kalavruti" },
      { name: "description", content: "Mirror work, embroidery and finishing — the craft details behind every Kalavruti lehenga." },
      { property: "og:title", content: "The Craft — Kalavruti" },
      { property: "og:description", content: "The mirror work, embroidery and borders behind every Kalavruti lehenga." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Craft,
});

const steps = [
  { n: "01", t: "Mirror", c: "Small mirrors set into the embroidery so the lehenga glows under festival lights.", img: images.mirror },
  { n: "02", t: "Thread", c: "Dense, colourful thread work across the blouse and skirt panels.", img: images.blouse },
  { n: "03", t: "Border", c: "A wide finished hem that gives weight and shape to the flare.", img: images.border },
  { n: "04", t: "Dupatta", c: "Light net with a mirror border, made to float behind every step.", img: images.dupatta },
];

function Craft() {
  return (
    <Page>
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="eyebrow text-accent">The Craft</p>
        <h1 className="mt-6 text-5xl leading-tight md:text-7xl">The quiet beauty of making slowly</h1>
      </section>
      <section className="mx-auto max-w-[1500px] space-y-24 px-6 pb-28 md:px-10">
        {steps.map((s, i) => (
          <div key={s.n} className="reveal grid items-center gap-10 md:grid-cols-2">
            <img src={s.img} alt={s.t} loading="lazy" className={`aspect-[4/3] w-full object-cover ${i % 2 ? "md:order-2" : ""}`} />
            <div className="md:px-12">
              <p className="font-serif text-6xl text-accent">{s.n}</p>
              <h2 className="mt-4 text-4xl md:text-5xl">{s.t}</h2>
              <p className="mt-6 max-w-md text-muted-foreground">{s.c}</p>
            </div>
          </div>
        ))}
      </section>
    </Page>
  );
}
