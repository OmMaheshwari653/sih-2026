"use client";

import { Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";

const districts = [
  "Prayagraj — Sadar Circle",
  "Prayagraj — Naini Circle",
  "Kaushambi",
  "Pratapgarh",
];

export const LmoLoginForm = () => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const submit = () => {
    setBusy(true);
    window.setTimeout(() => router.push("/lmo/dashboard"), 700);
  };

  return (
    <div className="rounded-gov border border-line bg-surface p-5 sm:p-6">
      <div className="space-y-4">
        <Field
          hint="As printed on your departmental identity card."
          label="Gov-ID"
          required
        >
          <Input placeholder="e.g. LMO/PRY/04" />
        </Field>

        <Field
          hint="You can only act on instruments inside your notified jurisdiction."
          label="District / Zone"
          required
        >
          <Select defaultValue={districts[0]}>
            {districts.map((district) => (
              <option key={district}>{district}</option>
            ))}
          </Select>
        </Field>

        <label className="flex items-center gap-2 text-xs text-ink-muted">
          <input className="size-3.5 accent-[#0b2b5c]" type="checkbox" />I
          accept the terms of use and consent to audit logging of this session.
        </label>

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
