export function normalizeEmailAddress(email: string): string {
  let address = email.trim().replace(/^mailto:/i, "");
  address = address.replace(/^https?:\/\//i, "");
  return address.trim();
}

export function toMailtoLink(email: string): string {
  const address = normalizeEmailAddress(email);

  if (!address || !address.includes("@")) {
    return "";
  }

  return `mailto:${address}`;
}

export function normalizeExternalUrl(url: string): string {
  const trimmed = url.trim();

  if (!trimmed || trimmed === "#") {
    return trimmed;
  }

  if (/^mailto:/i.test(trimmed)) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed.replace(/^\/+/, "")}`;
}
