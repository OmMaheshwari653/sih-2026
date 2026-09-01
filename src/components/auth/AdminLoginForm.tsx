"use client";

import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { storeSessionUser } from "@/lib/auth";

export const AdminLoginForm = () => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const submit = () => {
    setBusy(true);
    window.setTimeout(() => {
      storeSessionUser({ name: "Controller User", role: "admin" });
      router.push("/admin/dashboard");
    }, 700);
  };

  return (
    <div className="rounded-gov border border-line bg-surface p-5 sm:p-6">
      <div className="space-y-4">
        <Field
          hint="As assigned by the department for command access."
          label="Admin ID"
          required
        >
          <Input placeholder="e.g. CTR/UP/001" />
        </Field>

        <Field
          hint="Prototype build — any password is accepted."
          label="Password"
          required
        >
          <Input placeholder="Enter your password" type="password" />
        </Field>

        <Button block disabled={busy} onClick={submit}>
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <LogIn className="size-4" aria-hidden />
          )}
          Sign in
        </Button>
      </div>

      <p className="mt-5 border-t border-line-soft pt-4 text-center text-[11px] text-ink-muted">
        Trouble signing in?{" "}
        <Link
          className="font-semibold text-navy-500 hover:underline"
          href="/auth"
        >
          Choose a different role
        </Link>
      </p>
    </div>
  );
};
