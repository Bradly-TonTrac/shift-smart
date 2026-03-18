// Style metadata for each priority level — used to render badges and dots.
export const PRIORITY_META = {
  high: {
    label: "High",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-500 border-red-200",
  },
  medium: {
    label: "Medium",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-600 border-amber-200",
  },
  low: {
    label: "Low",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
};

// Style metadata for each status level — used to render status badges.
export const STATUS_META = {
  pending: {
    label: "Pending",
    ring: "border-gray-200 text-gray-400",
    dot: "bg-gray-300",
  },
  inprogress: {
    label: "In Progress",
    ring: "border-blue-200 text-blue-500",
    dot: "bg-blue-400 animate-pulse",
  },
  completed: {
    label: "Done",
    ring: "border-emerald-200 text-emerald-500",
    dot: "bg-emerald-400",
  },
};

export const PER_PAGE = 10;
