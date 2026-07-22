"use client";

import Link from "next/link";
import { useActionState } from "react";

import { updatePassword } from "@/app/admin/actions/auth";
import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminMessage,
  AdminSubmitButton,
} from "@/components/admin/AdminForm";

export default function ResetPasswordPage() {
  const [state, formAction] = useActionState(updatePassword, null);

  return (
    <AdminCard>
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Admin
        </p>
        <h1 className="mt-3 font-serif text-3xl tracking-[-0.02em] text-foreground">
          Choose a new password
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Set a new password for your admin account.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <AdminField label="New password">
          <AdminInput
            type="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </AdminField>

        <AdminMessage message={state?.error} />

        <div className="flex items-center justify-between gap-4">
          <Link
            href="/admin/login"
            className="text-sm text-muted transition-colors duration-300 hover:text-foreground"
          >
            Back to sign in
          </Link>
          <AdminSubmitButton>Update password</AdminSubmitButton>
        </div>
      </form>
    </AdminCard>
  );
}
