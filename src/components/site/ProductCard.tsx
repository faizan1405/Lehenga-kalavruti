import { Link } from "@tanstack/react-router";
import { formatPrice, type Product } from "@/data/catalog";

export function ProductCard({ p }: { p: Product }) {
  return (
    <Link to="/product/$slug" params={{ slug: p.slug }} className="reveal group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <img src={p.images[0]} alt={p.name} loading="lazy" width={896} height={1152}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 group-hover:opacity-0" />
        <img src={p.images[1]} alt="" loading="lazy" width={896} height={1152}
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-1000 group-hover:scale-100 group-hover:opacity-100" />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <h3 className="text-2xl">{p.name}</h3>
          <p className="eyebrow mt-1 text-muted-foreground">{p.type}</p>
        </div>
        <p className="text-sm">{formatPrice(p.price)}</p>
      </div>
    </Link>
  );
}
