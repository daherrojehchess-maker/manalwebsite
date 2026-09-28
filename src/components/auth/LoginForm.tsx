"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { signIn } from "@/lib/auth/actions";

export function LoginForm({ next = "/account" }: { next?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signIn(formData);
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="login-email" className="label">
          אימייל *
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          dir="ltr"
          className="field text-right"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="label">
          סיסמה *
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          dir="ltr"
          className="field text-right"
        />
      </div>
      <p className="text-sm">
        <Link href="/forgot-password" className="text-accent underline">
          שכחתי סיסמה
        </Link>
      </p>
      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="btn btn-primary min-h-12 w-full">
        {pending ? "מתחברים…" : "התחברות"}
      </button>
      <p className="text-center text-[15px] text-muted">
        אין לכם חשבון?{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-semibold text-accent underline">
          הרשמה
        </Link>
      </p>
    </form>
  );
}
