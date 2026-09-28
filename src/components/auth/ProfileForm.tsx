"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "@/lib/auth/actions";

export function ProfileForm({
  fullName,
  phone,
  email,
}: {
  fullName: string;
  phone: string;
  email: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage(result.message ?? "הפרטים נשמרו.");
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <div>
        <label htmlFor="profile-email" className="label">
          אימייל
        </label>
        <input id="profile-email" value={email} readOnly dir="ltr" className="field text-right bg-stone/60" />
      </div>
      <div>
        <label htmlFor="profile-fullName" className="label">
          שם מלא *
        </label>
        <input id="profile-fullName" name="fullName" defaultValue={fullName} autoComplete="name" required className="field" />
      </div>
      <div>
        <label htmlFor="profile-phone" className="label">
          טלפון נייד
        </label>
        <input
          id="profile-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          defaultValue={phone}
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
        <p role="status" className="text-sm font-medium text-success">
          {message}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className="btn btn-primary min-h-12 w-full sm:w-auto">
        {pending ? "שומרים…" : "שמירת פרטים"}
      </button>
    </form>
  );
}
