export const departmentColors: Record<
  string,
  {
    card: string;
    badge: string;
    dot: string;
    bg: string;
    text: string;
    avatar: string;
    border: string;
  }
> = {
  Engineering: {
    card: "border-l-4 border-emerald-400",
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-400",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    avatar: "bg-emerald-500",
    border: "border-emerald-200",
  },
  Design: {
    card: "border-l-4 border-rose-400",
    badge: "bg-rose-50 text-rose-700",
    dot: "bg-rose-400",
    bg: "bg-rose-50",
    text: "text-rose-700",
    avatar: "bg-rose-500",
    border: "border-rose-200",
  },
  Marketing: {
    card: "border-l-4 border-blue-400",
    badge: "bg-blue-50 text-blue-700",
    dot: "bg-blue-400",
    bg: "bg-blue-50",
    text: "text-blue-700",
    avatar: "bg-blue-500",
    border: "border-blue-200",
  },
  HR: {
    card: "border-l-4 border-violet-400",
    badge: "bg-violet-50 text-violet-700",
    dot: "bg-violet-400",
    bg: "bg-violet-50",
    text: "text-violet-700",
    avatar: "bg-violet-500",
    border: "border-violet-200",
  },
  Finance: {
    card: "border-l-4 border-orange-400",
    badge: "bg-orange-50 text-orange-700",
    dot: "bg-orange-400",
    bg: "bg-orange-50",
    text: "text-orange-700",
    avatar: "bg-orange-500",
    border: "border-orange-200",
  },
};

export const fallback = {
  card: "border-l-4 border-gray-300",
  badge: "bg-gray-100 text-gray-600",
  dot: "bg-gray-400",
  bg: "bg-gray-50",
  text: "text-gray-600",
  avatar: "bg-gray-400",
  border: "border-gray-200",
};

export const getColors = (dept: string) => departmentColors[dept] ?? fallback;
