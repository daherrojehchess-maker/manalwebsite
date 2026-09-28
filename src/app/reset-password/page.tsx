import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Breadcrumbs } from "@/components/ui/primitives";
import { getAuthState } from "@/lib/auth/session";

export const metadata: Metadata = { title: "סיסמה חדשה", robots: { index: false } };

export default async function ResetPasswordPage() {
  const { user } = await getAuthState();

  return (
    <div className="container-x max-w-lg pb-14">
      <Breadcrumbs items={[{ name: "סיסמה חדשה" }]} />
      <section className="card p-6 md:p-8">
        <h1 className="text-[26px] font-bold">בחירת סיסמה חדשה</h1>
        {user ? (
          <>
            <p className="mt-1 text-muted">הסיסמה החדשה צריכה להכיל לפחות 12 תווים.</p>
            <div className="mt-6">
              <ResetPasswordForm />
            </div>
          </>
        ) : (
          <p className="mt-4 text-sm text-muted">
            הקישור אינו תקף או שפג תוקפו.{" "}
            <Link href="/forgot-password" className="font-semibold text-accent underline">
              בקשו קישור חדש
            </Link>
          </p>
        )}
        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="underline">
            חזרה לחנות
          </Link>
        </p>
      </section>
    </div>
  );
}
