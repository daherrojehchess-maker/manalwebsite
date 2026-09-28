"use client";

import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/primitives";
import { whatsappHref } from "@/lib/site";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  if (pathname.startsWith("/checkout") || pathname.startsWith("/p/")) return null;
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener"
      aria-label="ייעוץ ב-WhatsApp"
      className="fixed bottom-[76px] left-4 z-30 grid size-13 place-items-center rounded-full bg-whatsapp text-white shadow-[var(--shadow-pop)] ring-4 ring-white transition-transform hover:scale-105 lg:bottom-6 lg:left-6 lg:size-14"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
