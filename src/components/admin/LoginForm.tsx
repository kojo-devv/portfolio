"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signIn } from "@/app/admin/actions/auth";
import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminMessage,
  AdminSubmitButton,
} from "@/components/admin/AdminForm";

type LoginFormProps = {
  next?: string;
  configurationError?: string;
};

export function LoginForm({ next, configurationError }: LoginFormProps) {
  const [state, formAction] = useActionState(signIn, null);

  return (
    <AdminCard>
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Admin
        </p>
        <h1 className="mt-3 font-serif text-3xl tracking-[-0.02em] text-foreground">
          Sign in
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Sign in to manage your portfolio content.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        {next ? <input type="hidden" name="next" value={next} /> : null}

        <AdminField label="Email">
          <AdminInput type="email" name="email" autoComplete="email" required />
        </AdminField>

        <AdminField label="Password">
          <AdminInput
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </AdminField>

        <AdminMessage message={configurationError ?? state?.error} />

        <div className="flex items-center justify-between gap-4">
          <Link
            href="/admin/forgot-password"
            className="text-sm text-muted transition-colors duration-300 hover:text-foreground"
          >
            Forgot password?
          </Link>
          <AdminSubmitButton>Sign in</AdminSubmitButton>
        </div>
      </form>
    </AdminCard>
  );
}
