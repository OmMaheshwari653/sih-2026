import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-gov text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45";

const variants = {
  primary: "bg-navy text-white hover:bg-navy-700",
  secondary: "border border-line bg-surface text-ink hover:bg-surface-alt",
  ghost: "text-navy-500 hover:bg-navy/5",
  danger: "bg-red-700 text-white hover:bg-red-800",
  success: "bg-india-green text-white hover:bg-emerald-800",
} as const;

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5",
  lg: "px-5 py-3 text-base",
} as const;

type Common = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  block?: boolean;
  children: ReactNode;
  className?: string;
};

const cls = ({
  variant = "primary",
  size = "md",
  block,
  className = "",
}: Common) =>
  `${base} ${variants[variant]} ${sizes[size]} ${block ? "w-full" : ""} ${className}`;

export const Button = ({
  variant,
  size,
  block,
  className,
  children,
  ...rest
}: Common & Omit<ComponentProps<"button">, "className" | "children">) => (
  <button
    className={cls({ variant, size, block, className, children })}
    type="button"
    {...rest}
  >
    {children}
  </button>
);

export const ButtonLink = ({
  variant,
  size,
  block,
  className,
  children,
  ...rest
}: Common & ComponentProps<typeof Link>) => (
  <Link
    className={cls({ variant, size, block, className, children })}
    {...rest}
  >
    {children}
  </Link>
);
