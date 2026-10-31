import { useId, type ComponentProps } from "react";

const fieldClass =
  "rounded-control-lg border border-line-input bg-surface px-3.5 text-base text-ink md:text-[15px] " +
  "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-600";

interface LabelProps {
  label: string;
  hint?: string;
}

export function Select({
  label,
  className = "",
  children,
  ...props
}: LabelProps & ComponentProps<"select">) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-bold text-text-2">
        {label}
      </label>
      <select id={id} className={`min-h-12 ${fieldClass} ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}

export function Textarea({
  label,
  hint,
  className = "",
  ...props
}: LabelProps & ComponentProps<"textarea">) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-bold text-text-2">
        {label} {hint && <span className="font-medium text-muted">{hint}</span>}
      </label>
      <textarea id={id} rows={4} className={`resize-y py-3 ${fieldClass} ${className}`} {...props} />
    </div>
  );
}
