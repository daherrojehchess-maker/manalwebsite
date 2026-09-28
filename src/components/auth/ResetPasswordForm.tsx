"use client";

import { useState, useTransition } from "react";
import { updatePassword } from "@/lib/auth/actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/errors";

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updatePassword(formData);
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <div>
        <label htmlFor="reset-password" className="label">
          סיסמה חדשה * <span className="font-normal text-muted">(לפחות {PASSWORD_MIN_LENGTH} תווים)</span>
        </label>
        <input
          id="reset-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          dir="ltr"
          className="field text-right"
        />
      </div>
      {error ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="btn btn-primary min-h-12 w-full">
        {pending ? "שומרים…" : "שמירת סיסמה"}
      </button>
    </form>
  );
}
