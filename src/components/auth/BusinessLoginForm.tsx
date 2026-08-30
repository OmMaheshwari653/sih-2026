"use client";

import { Loader2, LogIn, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

type Method = "otp" | "gstin" | "mobile";

const METHOD_LABEL: Record<Method, string> = {
  otp: "OTP",
  gstin: "GSTIN",
  mobile: "Mobile Number",
};

export const BusinessLoginForm = () => {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("otp");
  const [busy, setBusy] = useState(false);
  const [otpStage, setOtpStage] = useState(false);

  const submit = () => {
    setBusy(true);
    window.setTimeout(() => router.push("/business/dashboard"), 700);
  };

  const sendOtp = () => {
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setOtpStage(true);
    }, 700);
  };

  return (
    <div className="rounded-gov border border-line bg-surface p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap gap-1 rounded-gov border border-line bg-surface-alt p-1">
        {(["otp", "gstin", "mobile"] as Method[]).map((item) => (
          <button
            className={`flex-1 rounded-[3px] px-3 py-2 text-xs font-semibold transition-colors ${
              method === item
                ? "bg-navy text-white"
                : "text-ink-muted hover:text-ink"
            }`}
            key={item}
            onClick={() => {
              setMethod(item);
              setOtpStage(false);
            }}
            type="button"
          >
            {METHOD_LABEL[item]}
          </button>
        ))}
      </div>

      {method === "otp" ? (
        <div className="space-y-4">
          <Field
            hint="Only the number recorded against your establishment."
            label="Mobile number"
            required
          >
            <Input
              inputMode="numeric"
              placeholder="10-digit registered mobile"
            />
          </Field>

          {!otpStage ? (
            <Button block disabled={busy} onClick={sendOtp}>
              {busy ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Smartphone className="size-4" aria-hidden />
              )}
              Send OTP
            </Button>
          ) : (
            <>
              <Field
                hint="Prototype build — any code works."
                label="One-time password"
                required
              >
                <Input
                  inputMode="numeric"
                  placeholder="Enter the 6-digit OTP"
                />
              </Field>
              <Button block disabled={busy} onClick={submit}>
                {busy ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <LogIn className="size-4" aria-hidden />
                )}
                Verify &amp; sign in
              </Button>
            </>
          )}
        </div>
      ) : method === "gstin" ? (
        <div className="space-y-4">
          <Field
            hint="Used to pull your registered trade name and address."
            label="GSTIN"
            required
          >
            <Input placeholder="15-character GSTIN" />
          </Field>
          <Button block disabled={busy} onClick={submit}>
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <LogIn className="size-4" aria-hidden />
            )}
            Sign in with GSTIN
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Field
            hint="Only the number recorded against your establishment."
            label="Mobile number"
            required
          >
            <Input
              inputMode="numeric"
              placeholder="10-digit registered mobile"
            />
          </Field>
          <Button block disabled={busy} onClick={submit}>
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <LogIn className="size-4" aria-hidden />
            )}
            Sign in with mobile
          </Button>
        </div>
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
