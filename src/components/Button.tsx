import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
};

const VARIANTS = {
  primary: "bg-brand text-white hover:bg-brand/90",
  secondary: "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50",
};

export function Button({
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-70 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
