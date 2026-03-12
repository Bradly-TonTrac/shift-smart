import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility that merges Tailwind classes and resolves conflicts using clsx and tailwind-merge.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
