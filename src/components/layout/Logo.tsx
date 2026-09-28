import Link from "next/link";
import { site } from "@/lib/site";

/** Placeholder logo — replace the mark and wordmark with the real [לוגו] asset. */
export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${site.name} — דף הבית`}>
      <span className="grid size-10 place-items-center rounded-md bg-accent text-white md:size-11" aria-hidden>
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
          <path d="M3 20h18M5 20V10l7-5 7 5v10" />
          <path d="M9 20v-6h6v6" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`text-[17px] font-bold md:text-lg ${inverted ? "text-white" : "text-ink"}`}>{site.name}</span>
        <span className={`hidden text-[12px] font-medium sm:block ${inverted ? "text-white/70" : "text-muted"}`}>{site.tagline}</span>
      </span>
    </Link>
  );
}
