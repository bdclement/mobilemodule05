import { FEELINGS } from "./notes";

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

export function computePercentages(notes) {
  if (!notes) return null;
  console.log("Notes in compute == ", notes);
  const total = notes.length
  console.log("Total in compute == ", total);
  if (total === 0) return null;

  const counts = notes.reduce((acc, note) => {
    // Comptage des icons
    console.log("icon dans le reduce : ", note.icon);
    if (FEELINGS[note?.icon] !== undefined) {
      acc[note.icon] = (acc[note.icon] || 0) + 1
    }

    return acc;
  }, {});
  console.log("Test in computePercentages", counts);
  return Object.keys(FEELINGS).map(f => [ f, Math.round(((counts[f] || 0) / total) * 100)])
};