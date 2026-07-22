import { cn } from "@/lib/cn";

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-surface p-6 shadow-[0_16px_40px_-28px_rgba(17,17,17,0.1)] sm:p-8",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function AdminField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium tracking-[-0.01em] text-foreground">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-2 block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function AdminInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors duration-300 focus:border-neutral-400",
        className,
      )}
      {...props}
    />
  );
}

export function AdminTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-32 w-full rounded-md border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors duration-300 focus:border-neutral-400",
        className,
      )}
      {...props}
    />
  );
}

export function AdminSelect({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors duration-300 focus:border-neutral-400",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export function AdminSubmitButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
}) {
  const styles = {
    primary:
      "border border-foreground bg-foreground text-background hover:bg-neutral-800",
    secondary:
      "border border-border bg-transparent text-foreground hover:border-neutral-400 hover:bg-background",
    danger:
      "border border-red-300 bg-red-50 text-red-700 hover:bg-red-100",
  } as const;

  return (
    <button
      type="submit"
      className={cn(
        "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium tracking-[-0.01em] transition-colors duration-300",
        styles[variant],
      )}
    >
      {children}
    </button>
  );
}

export function AdminMessage({ message }: { message?: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-md border border-border bg-background px-4 py-3 text-sm text-muted">
      {message}
    </p>
  );
}
