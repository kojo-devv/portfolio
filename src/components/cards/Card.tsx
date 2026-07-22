import { cn } from "@/lib/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <article
      className={cn(
        "rounded-sm border border-border bg-surface p-6 md:p-8",
        className,
      )}
    >
      {children}
    </article>
  );
}
