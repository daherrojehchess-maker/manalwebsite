"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { requestPasswordReset } from "@/lib/auth/actions";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await requestPasswordReset(formData);
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
      <div>
        <label htmlFor="forgot-email" className="label">
          אימייל *
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          required
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
          {message}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="btn btn-primary min-h-12 w-full">
        {pending ? "שולחים…" : "שליחת קישור לאיפוס"}
      </button>
      <p className="text-center text-[15px] text-muted">
        <Link href="/login" className="font-semibold text-accent underline">
          חזרה להתחברות
        </Link>
      </p>
    </form>
  );
}
