"use client";

import { KeyRound, Loader2, ShieldCheck, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";

type Mode = { id: string; label: string; placeholder: string; hint: string };

export const LoginPanel = ({
  modes,
  destination,
  districts,
  twoFactor,
  demoIdentifier,
}: {
  modes: Mode[];
  destination: string;
  districts?: string[];
  twoFactor?: boolean;
  demoIdentifier: string;
}) => {
  const router = useRouter();
  const [mode, setMode] = useState(modes[0].id);
  const [stage, setStage] = useState<"identify" | "otp">("identify");
  const [busy, setBusy] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const activeMode = modes.find((item) => item.id === mode) ?? modes[0];

  const sendOtp = () => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setStage("otp");
    }, 700);
  };

  const submit = () => {
    setBusy(true);
    window.setTimeout(() => router.push(destination), 700);
  };

  return (
    <div className="rounded-gov border border-line bg-surface p-5 sm:p-6">
      {stage === "identify" ? (
        <>
          <div className="mb-4 flex flex-wrap gap-1 rounded-gov border border-line bg-surface-alt p-1">
            {modes.map((item) => (
              <button
                className={`flex-1 rounded-[3px] px-3 py-2 text-xs font-semibold transition-colors ${
                  mode === item.id
                    ? "bg-navy text-white"
                    : "text-ink-muted hover:text-ink"
                }`}
                key={item.id}
                onClick={() => setMode(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <Field hint={activeMode.hint} label={activeMode.label} required>
              <Input
                defaultValue={demoIdentifier}
                placeholder={activeMode.placeholder}
              />
            </Field>

            {districts ? (
              <Field
                hint="You can only act on instruments inside your notified jurisdiction."
                label="Jurisdiction"
                required
              >
                <Select defaultValue={districts[0]}>
                  {districts.map((district) => (
                    <option key={district}>{district}</option>
                  ))}
                </Select>
              </Field>
            ) : null}

            <label className="flex items-center gap-2 text-xs text-ink-muted">
              <input className="size-3.5 accent-[#0b2b5c]" type="checkbox" />I
              accept the terms of use and consent to audit logging of this
              session.
            </label>

            <Button block disabled={busy} onClick={sendOtp}>
              {busy ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Smartphone className="size-4" aria-hidden />
              )}
              Send one-time password
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-navy/8 text-navy">
              <KeyRound className="size-4.5" aria-hidden />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-ink">
                Enter the {twoFactor ? "authenticator" : "OTP"} code
              </h2>
              <p className="text-[11px] text-ink-muted">
                {twoFactor
                  ? "6-digit code from your departmental authenticator app."
                  : "Sent to the mobile registered against this business."}
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            {otp.map((digit, index) => (
              <input
                aria-label={`Digit ${index + 1}`}
                className="num size-11 rounded-gov border border-line bg-surface text-center text-lg font-bold text-ink outline-none focus:border-navy-500 sm:size-12"
                inputMode="numeric"
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length OTP boxes
                key={index}
                maxLength={1}
                onChange={(event) => {
                  const next = [...otp];
                  next[index] = event.target.value.replace(/\D/g, "").slice(-1);
                  setOtp(next);
                  const sibling = event.target
                    .nextElementSibling as HTMLInputElement | null;
                  if (next[index] && sibling) sibling.focus();
                }}
                value={digit}
              />
            ))}
          </div>

          <p className="mt-2.5 text-[11px] text-ink-muted">
            Prototype build — any code works. Resend available in 00:28.
          </p>

          <Button block className="mt-4" disabled={busy} onClick={submit}>
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <ShieldCheck className="size-4" aria-hidden />
            )}
            Verify &amp; continue
          </Button>

          <button
            className="mt-3 w-full text-center text-xs text-navy-500 hover:underline"
            onClick={() => setStage("identify")}
            type="button"
          >
            Change the number / ID
          </button>
        </>
      )}

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
