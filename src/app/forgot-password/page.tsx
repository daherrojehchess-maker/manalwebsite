import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { Breadcrumbs } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "איפוס סיסמה", robots: { index: false } };

type Props = { searchParams: Promise<{ e?: string }> };

export default async function ForgotPasswordPage({ searchParams }: Props) {
  const sp = await searchParams;

  return (
    <div className="container-x max-w-lg pb-14">
      <Breadcrumbs items={[{ name: "איפוס סיסמה" }]} />
      <section className="card p-6 md:p-8">
        <h1 className="text-[26px] font-bold">איפוס סיסמה</h1>
        <p className="mt-1 text-muted">הזינו את כתובת האימייל של החשבון.</p>
        {sp.e ? (
          <p role="alert" className="mt-4 text-sm font-medium text-danger">
            הקישור אינו תקף או שפג תוקפו. אפשר לבקש קישור חדש.
          </p>
        ) : null}
        <div className="mt-6">
          <ForgotPasswordForm />
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
