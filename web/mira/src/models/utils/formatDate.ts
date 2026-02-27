export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}
