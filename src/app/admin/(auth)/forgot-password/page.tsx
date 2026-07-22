"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestPasswordReset } from "@/app/admin/actions/auth";
import {
  AdminCard,
  AdminField,
  AdminInput,
  AdminMessage,
  AdminSubmitButton,
} from "@/components/admin/AdminForm";

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, null);

  return (
    <AdminCard>
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Admin
        </p>
        <h1 className="mt-3 font-serif text-3xl tracking-[-0.02em] text-foreground">
          Reset password
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Enter your admin email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <AdminField label="Email">
          <AdminInput type="email" name="email" autoComplete="email" required />
        </AdminField>

        <AdminMessage
          message={
            state?.error ??
            (state?.success
              ? "If an account exists for that email, a reset link has been sent."
              : null)
          }
        />

        <div className="flex items-center justify-between gap-4">
          <Link
            href="/admin/login"
            className="text-sm text-muted transition-colors duration-300 hover:text-foreground"
          >
            Back to sign in
          </Link>
          <AdminSubmitButton>Send reset link</AdminSubmitButton>
        </div>
      </form>
    </AdminCard>
  );
}
