"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signUp } from "@/lib/auth/actions";

export function RegisterForm({ next = "/account" }: { next?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signUp(formData);
      if (!result) return;
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (result.message) setMessage(result.message);
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="reg-fullName" className="label">
          שם מלא *
        </label>
        <input id="reg-fullName" name="fullName" autoComplete="name" required className="field" />
      </div>
      <div>
        <label htmlFor="reg-email" className="label">
          אימייל *
        </label>
        <input id="reg-email" name="email" type="email" autoComplete="email" required dir="ltr" className="field text-right" />
      </div>
      <div>
        <label htmlFor="reg-phone" className="label">
          טלפון נייד
        </label>
        <input id="reg-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className="field text-right" placeholder="05xxxxxxxx" />
      </div>
      <div>
        <label htmlFor="reg-password" className="label">
          סיסמה * <span className="font-normal text-muted">(לפחות 12 תווים)</span>
        </label>
        <input
          id="reg-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          dir="ltr"
          className="field text-right"
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="rounded-md bg-accent-soft p-3 text-sm font-medium text-ink">
          {message}{" "}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="underline">
            להתחברות
          </Link>
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="btn btn-primary min-h-12 w-full">
        {pending ? "נרשמים…" : "יצירת חשבון"}
      </button>
      <p className="text-center text-[15px] text-muted">
        כבר רשומים?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-semibold text-accent underline">
          התחברות
        </Link>
      </p>
    </form>
  );
}
