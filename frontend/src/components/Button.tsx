import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";
type Size = "md" | "lg";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex cursor-pointer items-center justify-center font-bold transition-[colors,transform] active:scale-[0.97] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "border border-line bg-surface text-brand-600 hover:bg-brand-50",
};

// Tinggi minimum 44px (md) agar mudah disentuh; lg dipakai tombol penuh di form.
const sizes: Record<Variant, Record<Size, string>> = {
  primary: {
    md: "min-h-11 rounded-control-lg px-5 text-[15px]",
    lg: "min-h-13 rounded-[14px] px-5 text-base md:min-h-12 md:rounded-control-lg",
  },
  secondary: {
    md: "min-h-11 rounded-control px-4 text-sm",
    lg: "min-h-12 rounded-control px-4 text-sm",
  },
};

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[variant][size]} ${className}`}
      {...props}
    />
  );
}
