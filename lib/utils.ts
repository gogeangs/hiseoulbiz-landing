import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isApplicationOpen(): boolean {
  const deadline = new Date("2026-03-31T23:59:59+09:00");
  return new Date() <= deadline;
}

export const UCANSIGN_URL = process.env.NEXT_PUBLIC_UCANSIGN_URL || "#";

export const APPLY_URL = "/apply";
