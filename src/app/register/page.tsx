import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/primitives";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { safeRedirectPath } from "@/lib/auth/safe-redirect";

export const metadata: Metadata = { title: "הרשמה", robots: { index: false } };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function RegisterPage({ searchParams }: Props) {
  const sp = await searchParams;
  const next = safeRedirectPath(sp.next);

  return (
    <div className="container-x max-w-lg pb-14">
      <Breadcrumbs items={[{ name: "הרשמה" }]} />
      <section className="card p-6 md:p-8">
        <h1 className="text-[26px] font-bold">יצירת חשבון</h1>
        <p className="mt-1 text-muted">החשבון נוצר כלקוח. אין אפשרות לבחור תפקיד מנהל בהרשמה.</p>
        <div className="mt-6">
          <RegisterForm next={next} />
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="underline">
            חזרה לחנות
          </Link>
        </p>
      </section>
    </div>
  );
}
