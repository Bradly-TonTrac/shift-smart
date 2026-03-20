import { PRIORITY_META, STATUS_META } from "@/lib/constants";
import { Task } from "@/types";

interface BadgeProps {
  type: "priority" | "status";
  value: Task["priority"] | Task["status"];
}

const Badge = ({ type, value }: BadgeProps) => {
  const meta =
    type === "priority"
      ? PRIORITY_META[value as Task["priority"]]
      : STATUS_META[value as Task["status"]];

  return (
    <span
      className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
        type === "priority"
          ? (meta as (typeof PRIORITY_META)[Task["priority"]]).badge
          : (meta as (typeof STATUS_META)[Task["status"]]).ring
      }`}
    >
      {meta.label}
    </span>
  );
};

export default Badge;
