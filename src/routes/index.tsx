import { createFileRoute, Link } from "@tanstack/react-router";
import { DepthCollections, HorizontalLookbook, TextMask, VelocitySkew } from "@/components/experience/HomeExperiences";
import { ShopByColour, LookCloser, LehengaMovement, NineNights, GarbaCircle, ShopByOccasion, NavratriNight } from "@/components/experience/NavratriSections";
import { FabricHero } from "@/components/experience/FabricHero";
import { Page } from "@/components/site/Layout";
import { ProductCard } from "@/components/site/ProductCard";
import { products, journal, images } from "@/data/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kalavruti — Navratri Lehengas, Made for the Garba Spin" },
      { name: "description", content: "Navratri and festive lehengas with mirror work, embroidery and flare made to move. Shop the Navratri 2026 collection." },
      { property: "og:title", content: "Kalavruti — Navratri Lehengas, Made for the Garba Spin" },
      { property: "og:description", content: "Navratri lehengas made for colour, movement and the Garba spin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <Page overlay>
      <VelocitySkew />
      <FabricHero />

      {/* New collection — products first */}
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow reveal text-accent">New Navratri Collection</p>
              <h2 className="reveal mt-4 text-4xl md:text-6xl">Lehengas made for the circle</h2>
            </div>
            <Link to="/shop" className="eyebrow border-b border-foreground pb-1">Shop all lehengas</Link>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4">
            {products.slice(0, 4).map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      <LehengaMovement />
      <ShopByColour />
      <LookCloser />
      <NineNights />
      <ShopByOccasion />

      {/* Fabric & craft */}
      <section className="grid bg-card md:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden md:aspect-auto">
          <img src={images.border} alt="Lehenga hem border with gota and mirror work" loading="lazy" width={1024} height={1024} className="reveal h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center px-8 py-20 md:px-20">
          <p className="eyebrow reveal text-accent">Fabric & Craft</p>
          <h2 className="reveal mt-6 text-4xl leading-tight md:text-6xl">Every detail catches the light</h2>
          <ul className="reveal mt-8 grid grid-cols-2 gap-3 text-muted-foreground">
            {["Mirror work", "Thread embroidery", "Gota details", "Sequin detail", "Bandhani-inspired", "Hand-finished border"].map((c) => <li key={c}>— {c}</li>)}
          </ul>
          <Link to="/craft" className="eyebrow reveal mt-10 self-start border-b border-foreground pb-1">Explore the craft</Link>
        </div>
      </section>

      <HorizontalLookbook />
      <GarbaCircle />

      <section className="px-6 py-28 md:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-14 text-center">
            <p className="eyebrow reveal text-accent">Bestselling Lehengas</p>
            <h2 className="reveal mt-4 text-4xl md:text-6xl">Loved for the dance floor</h2>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4">
            {products.slice(4, 8).map((p) => <ProductCard key={p.slug} p={p} />)}
          </div>
        </div>
      </section>

      <DepthCollections />

      {/* Custom & size */}
      <section className="bg-primary px-6 py-24 text-primary-foreground md:px-10">
        <div className="mx-auto grid max-w-[1300px] gap-12 md:grid-cols-3">
          {[["Made to measure", "Share your measurements and we tailor the blouse and waist to you."], ["Size guide", "Ready sizes XS–XXL with an adjustable drawstring waist."], ["Talk to a stylist", "Questions about colour, fit or delivery before Navratri? Ask us on WhatsApp."]].map(([t, c]) => (
            <div key={t} className="reveal border-t border-primary-foreground/20 pt-6">
              <h3 className="text-3xl">{t}</h3>
              <p className="mt-3 text-primary-foreground/70">{c}</p>
            </div>
          ))}
        </div>
      </section>

      <NavratriNight />
      <TextMask word="GARBA" />

      {/* Journal */}
      <section className="px-6 py-28 md:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="v-skew reveal text-4xl md:text-6xl">The Festive Journal</h2>
            <Link to="/journal" className="eyebrow border-b border-foreground pb-1">Read all</Link>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            {journal.map((j) => (
              <Link to="/journal" key={j.slug} className="reveal group block">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={j.image} alt={j.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.6s] group-hover:scale-105" />
                </div>
                <p className="eyebrow mt-5 text-muted-foreground">{j.date}</p>
                <h3 className="mt-2 text-2xl leading-snug">{j.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{j.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}
