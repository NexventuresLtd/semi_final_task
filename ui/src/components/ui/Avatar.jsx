export default function Avatar({ name, email, size = "md", className = "" }) {
  const initials = getInitials(name, email);
  const sizes = { sm: "w-9 h-9 text-xs", md: "w-10 h-10 text-sm", lg: "w-16 h-16 text-lg" };

  return (
    <div className={`${sizes[size]} rounded-full bg-blue text-white flex items-center justify-center font-display font-semibold shrink-0 ${className}`}>
      {initials}
    </div>
  );
}

// First letter of first + last name (e.g. "Kamanzi Shukuru" -> "JC").
// Falls back to the first two letters of the email if no usable name exists.
function getInitials(name, email) {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}