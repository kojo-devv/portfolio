import { LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { next, error } = await searchParams;

  const configurationError =
    error === "configuration" || !isSupabaseConfigured()
      ? "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the dev server."
      : error
        ? decodeURIComponent(error)
        : undefined;

  return <LoginForm next={next} configurationError={configurationError} />;
}
