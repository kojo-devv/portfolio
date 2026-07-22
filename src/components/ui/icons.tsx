import { cn } from "@/lib/cn";

type IconProps = {
  className?: string;
};

export function MailIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 11v5M8 8v.01M12 16v-5c0-1.1.9-2 2-2s2 .9 2 2v5" />
    </svg>
  );
}

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-5 w-5", className)}
    >
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .3-1.7 1-2.3-2.7-1.3-5.5-3.2-5.5-7.2 0-1.6.6-2.9 1.5-3.9-.2-.4-.7-1.8.1-3.8 0 0 1.2-.4 4 1.5a13.8 13.8 0 0 1 7 0c2.8-1.9 4-1.5 4-1.5.8 2 .3 3.4.1 3.8 1 .9 1.5 2.3 1.5 3.9 0 4-2.8 5.9-5.5 7.2.7.6 1 1.3 1 2.3V21" />
    </svg>
  );
}
