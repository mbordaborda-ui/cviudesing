const MONTHS = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

/** "2026-07-07" → "jul 2026" */
export function formatMonth(iso: string): string {
  const [year, month] = iso.split("-").map(Number);
  if (!year || !month) return iso;
  return `${MONTHS[month - 1]} ${year}`;
}

export function formatRange(start: string, end: string, current: boolean) {
  return `${formatMonth(start)} — ${current ? "presente" : formatMonth(end)}`;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
