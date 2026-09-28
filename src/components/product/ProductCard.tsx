import Link from "next/link";
import { ProductArt } from "@/components/art/ProductArt";
import { DiscountBadge, Price, StockBadge } from "@/components/ui/primitives";
import type { CardProduct } from "@/lib/catalog";
import { CardCartButton, QuoteLinkButton, WishlistButton } from "./ProductActions";

export function ProductCard({ product, showQuote = false }: { product: CardProduct; showQuote?: boolean }) {
  const href = `/p/${product.slug}`;
  return (
    <article className="group card relative flex h-full flex-col overflow-hidden transition-shadow hover:shadow-[var(--shadow-pop)]">
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden className="block aspect-square bg-stone/60 p-6">
          <ProductArt art={product.art} className="size-full transition-transform duration-200 group-hover:scale-[1.03]" />
        </Link>
        <div className="absolute start-3 top-3 flex flex-col items-start gap-1.5">
          <DiscountBadge price={product.price} compareAt={product.compareAt} />
          {product.tags.includes("new") ? <span className="rounded-[5px] bg-ink px-2 py-0.5 text-[13px] font-semibold text-white">חדש</span> : null}
        </div>
        <WishlistButton id={product.id} name={product.name} className="absolute end-3 top-3" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="min-h-5 text-[13px] font-semibold uppercase tracking-wide text-muted">
          <bdi>{product.brandName}</bdi>
        </p>
        <h3 className="line-clamp-2 min-h-12 text-[16px] font-semibold leading-6">
          <Link href={href} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="min-h-5 text-sm text-muted">{product.variantHint}</p>
        <StockBadge stock={product.stock} />
        <div className="mt-auto pt-2">
          <Price price={product.price} compareAt={product.compareAt} />
          <p className="text-[13px] text-muted">{product.hasOptions ? "מחיר התחלתי · כולל מע״מ" : `כולל מע״מ · ל${product.unit === "יח׳" ? "יחידה" : product.unit}`}</p>
        </div>
        <div className="pt-3">
          <CardCartButton id={product.id} name={product.name} slug={product.slug} hasOptions={product.hasOptions} outOfStock={product.stock === "out"} />
          {showQuote ? <QuoteLinkButton id={product.id} name={product.name} unit={product.unit} /> : null}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, showQuote }: { products: CardProduct[]; showQuote?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
      {products.map((p) => (
        <li key={p.id}>
          <ProductCard product={p} showQuote={showQuote} />
        </li>
      ))}
    </ul>
  );
}
