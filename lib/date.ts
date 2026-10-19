export function formatDreamDate(date: string, locale: string = "en") {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString(locale, {
    year: "numeric", month: "long", day: "numeric", timeZone: "UTC",
  });
}

export function localToday() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}
