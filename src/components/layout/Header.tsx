import { Truck } from "lucide-react";
import { phoneHref, site } from "@/lib/site";
import { HeaderActions } from "./HeaderActions";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { getMenuData } from "./menu-data";
import { MobileMenu } from "./MobileMenu";
import { SearchBox } from "./SearchBox";

export function AnnouncementBar() {
  return (
    <div className="bg-ink text-[13px] text-white md:text-sm">
      <div className="container-x flex h-9 items-center justify-center gap-6 md:justify-between">
        <p className="flex items-center gap-2">
          <Truck className="size-4 text-white/80" aria-hidden />
          משלוחים מהירים לכל הארץ · משלוח חינם בקנייה מעל {site.freeShippingText}
        </p>
        <a href={phoneHref()} className="hidden font-medium text-white/90 hover:text-white md:block">
          הזמנות וייעוץ: <bdi>{site.phoneDisplay}</bdi>
        </a>
      </div>
    </div>
  );
}

export function Header() {
  const menu = getMenuData();
  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_var(--color-line)]">
        <div className="container-x flex h-16 items-center gap-2 md:h-[76px] md:gap-6">
          <MobileMenu data={menu} />
          <Logo />
          <SearchBox className="mx-auto hidden max-w-[680px] flex-1 lg:block" />
          <div className="ms-auto lg:ms-0">
            <HeaderActions />
          </div>
        </div>
        <div className="container-x pb-3 lg:hidden">
          <SearchBox size="md" />
        </div>
      </header>
      <MegaMenu data={menu} />
    </>
  );
}
