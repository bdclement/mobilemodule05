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
  // console.log("Notes in compute == ", notes);
  const total = notes.length
  // console.log("Total in compute == ", total);
  if (total === 0) return null;

  const counts = notes.reduce((acc, note) => {
    // Comptage des icons
    // console.log("icon dans le reduce : ", note.icon);
    if (FEELINGS[note?.icon] !== undefined) {
      acc[note.icon] = (acc[note.icon] || 0) + 1
    }

    return acc;
  }, {});
  // console.log("Test in computePercentages", counts);
  return Object.keys(FEELINGS).map(f => [ f, Math.round(((counts[f] || 0) / total) * 100)])
};

export const formatLocalDate = (iso) => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const formatDatePartsEn = (iso) => {
  const date = new Date(iso);

  const day = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
  }).format(date);

  const month = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(date);

  const year = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
  }).format(date);

  return { day, month, year };
};