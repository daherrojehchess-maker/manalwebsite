"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth/actions";

export function LogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => signOut())}
      className="btn min-h-11 border border-line-strong bg-white text-ink hover:border-ink"
    >
      <LogOut className="size-4" aria-hidden />
      {pending ? "מתנתקים…" : "התנתקות"}
    </button>
  );
}
