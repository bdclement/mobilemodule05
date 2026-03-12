export function getDisplayName(user) {
  if (!user) return "";

  const metadata = user.user_metadata ?? {};
  const email = user.email ?? "";

  return (
    metadata.full_name ||
    metadata.name ||
    metadata.username ||
    metadata.preferred_username ||
    (email ? email.split("@")[0] : "")
  );
}

export function getAvatarUrl(user) {
  if (!user) return null;

  const metadata = user.user_metadata ?? {};

  return (
    metadata.avatar_url ||
    metadata.picture ||
    null
  );
}