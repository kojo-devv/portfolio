"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/app/admin/actions/auth";
import { AdminNav } from "@/components/admin/AdminNav";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <div>
            <Link
              href="/admin"
              className="text-[17px] font-medium tracking-[-0.02em] text-foreground"
            >
              Portfolio Admin
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-muted transition-colors duration-300 hover:text-foreground"
            >
              View site
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors duration-300 hover:border-neutral-400 hover:bg-background"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-surface lg:hidden">
        <div className="mx-auto max-w-7xl overflow-x-auto px-6 py-3 sm:px-8">
          <AdminNav pathname={pathname} className="min-w-max flex-row gap-1" />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 lg:grid-cols-[220px_minmax(0,1fr)] sm:px-8">
        <aside className="hidden lg:block">
          <AdminNav pathname={pathname} />
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="font-serif text-3xl tracking-[-0.02em] text-foreground">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function AdminSuccessMessage({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground">
      {message}
    </p>
  );
}

export function AdminErrorMessage({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </p>
  );
}
