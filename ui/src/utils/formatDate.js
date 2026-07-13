/**
 * Centralized date formatting so every component uses the same style
 * and locale, instead of each one inlining its own toLocaleDateString call.
 */
export function formatDate(dateInput, locale = "en") {
  const date = new Date(dateInput);
  return date.toLocaleDateString(localeToIntl(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateInput, locale = "en") {
  const date = new Date(dateInput);
  return date.toLocaleString(localeToIntl(locale), {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatRelativeTime(dateInput) {
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateInput);
}

// Kinyarwanda has no widely supported Intl locale code yet in most browsers,
// so we fall back to English date formatting for "rw" while keeping the
// rest of the UI text translated.
function localeToIntl(locale) {
  const map = { en: "en-US", fr: "fr-FR", rw: "en-US" };
  return map[locale] || "en-US";
}