import { useId, type ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
}

// Font 16px di mobile supaya iOS tidak zoom saat fokus.
export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-[13px] font-bold text-text-2">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`min-h-12 rounded-control-lg border bg-surface px-3.5 text-base text-ink placeholder:text-muted/70 md:text-[15px] ${
          error ? "border-danger" : "border-line-input"
        } focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand-600 ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-[13px] font-semibold text-danger">
          {error}
        </p>
      )} 
    </div>
  );
}
