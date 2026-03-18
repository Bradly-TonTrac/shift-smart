import { getColors } from "@/lib/utils/departments";
import { getInitials } from "@/lib/utils/formatters";

interface AvatarProps {
  name: string;
  department: string;
  size?: "sm" | "lg";
}
const Avatar = ({ name, department, size }: AvatarProps) => {
  const colors = getColors(department);
  const initials = getInitials(name);
  return (
    <div>
      <div
        className={` ${colors.avatar} flex items-center justify-center text-white   ${size === "sm" ? "w-8 h-8 rounded-xl text-xs " : " w-16 h-16 rounded-2xl text-xl font-bold shadow-sm border-4 border-white"}`}
      >
        {initials}
      </div>
    </div>
  );
};

export default Avatar;
