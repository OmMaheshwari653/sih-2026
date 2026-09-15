import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold tracking-tight transition-all duration-200 ease-glass active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45";

const variants = {
  primary: "btn-ink hover:brightness-125",
  secondary: "glass text-ink hover:bg-white/80",
  ghost: "text-navy-500 hover:bg-navy-500/8",
  danger:
    "bg-linear-to-b from-red-500 to-red-700 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_8px_20px_-8px_rgb(185_28_28/0.6)] hover:brightness-110",
  success:
    "bg-linear-to-b from-emerald-500 to-emerald-700 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_8px_20px_-8px_rgb(4_120_87/0.6)] hover:brightness-110",
} as const;

const sizes = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-5 py-2.5",
  lg: "px-6 py-3 text-base",
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
