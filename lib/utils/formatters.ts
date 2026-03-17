export const formatDate = (s: string) => {
  if (!s) return "";
  const d = new Date(s);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-ZA", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

export const formatTime = (s: string) => {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleTimeString("en-ZA", {
        hour: "2-digit",
        minute: "2-digit",
      });
};

export const formatMins = (m: number | string) => {
  const n = Number(m) || 0;
  return n === 0 ? "—" : `${Math.floor(n / 60)}h ${n % 60}m`;
};

export const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
