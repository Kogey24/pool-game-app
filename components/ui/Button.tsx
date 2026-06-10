import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "amber";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-accent-green bg-accent-green text-white hover:bg-[#168760]",
  secondary:
    "border-pool-border bg-pool-card text-pool-text hover:border-accent-green hover:bg-[#1f2a1f]",
  ghost:
    "border-transparent bg-transparent text-pool-muted hover:bg-white/5 hover:text-pool-text",
  danger:
    "border-accent-red bg-[var(--color-accent-red-bg)] text-red-100 hover:bg-[#421a1a]",
  amber:
    "border-accent-amber bg-amber-500/10 text-amber-100 hover:bg-amber-500/20",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
  icon: "h-11 w-11 p-0",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  icon,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border font-medium transition disabled:cursor-not-allowed disabled:opacity-45",
        variants[variant],
        sizes[size],
        className,
      )}
      type={type}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
