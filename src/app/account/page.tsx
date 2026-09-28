import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, Heart, Package, UserRound } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/primitives";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "החשבון שלי", robots: { index: false } };

const links = [
  { href: "/store", icon: Package, title: "מעקב הזמנה", text: "שאלה על הזמנה קיימת? צרו קשר עם מספר ההזמנה" },
  { href: "/quote", icon: ClipboardList, title: "רשימת הצעת מחיר", text: "פריטים שמורים לבקשת הצעה" },
  { href: "/wishlist", icon: Heart, title: "מועדפים", text: "מוצרים ששמרתם" },
  { href: "/pros", icon: UserRound, title: "חשבון עסקי", text: "מחירים לאנשי מקצוע וקבלנים" },
];

export default async function AccountPage() {
  const { user, profile, role } = await requireUser("/account");

  return (
    <div className="container-x pb-14">
      <Breadcrumbs items={[{ name: "החשבון שלי" }]} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
        <section className="card p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-[26px] font-bold">שלום{profile?.full_name ? `, ${profile.full_name}` : ""}</h1>
              <p className="mt-1 text-muted">
                מחוברים כ־
                <span className="font-medium text-ink">{role === "admin" ? "מנהל" : "לקוח"}</span>
              </p>
            </div>
            <LogoutButton />
          </div>
          <div className="mt-8">
            <h2 className="text-xl font-bold">פרטי החשבון</h2>
            <p className="mt-1 text-[15px] text-muted">עדכון שם וטלפון. תפקיד המשתמש אינו ניתן לשינוי מכאן.</p>
            <div className="mt-5">
              <ProfileForm fullName={profile?.full_name ?? ""} phone={profile?.phone ?? ""} email={user.email ?? ""} />
            </div>
          </div>
        </section>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {links.map(({ href, icon: Icon, title, text }) => (
            <li key={title}>
              <Link href={href} className="card flex h-full items-start gap-4 p-5 hover:border-ink">
                <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                  <Icon className="size-6" strokeWidth={1.75} aria-hidden />
                </span>
                <span>
                  <span className="block text-lg font-bold">{title}</span>
                  <span className="block text-[15px] text-muted">{text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
