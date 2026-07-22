"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AdminErrorMessage,
  AdminSuccessMessage,
} from "@/components/admin/AdminShell";

type AdminSaveFormProps = {
  action: (formData: FormData) => Promise<void>;
  children: React.ReactNode;
  submitLabel?: string;
  className?: string;
};

export function AdminSaveForm({
  action,
  children,
  submitLabel = "Save changes",
  className,
}: AdminSaveFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const formData = new FormData(event.currentTarget);
      await action(formData);
      setSuccessMessage("Changes saved successfully.");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to save changes.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
      <div className="space-y-3 pt-2">
        <AdminSuccessMessage message={successMessage} />
        <AdminErrorMessage message={errorMessage} />
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-md border border-foreground bg-foreground px-5 py-3 text-sm font-medium tracking-[-0.01em] text-background transition-colors duration-300 hover:bg-neutral-800 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
