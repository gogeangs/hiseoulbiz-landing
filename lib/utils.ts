import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DEADLINE_ISO } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isApplicationOpen(): boolean {
  return new Date() <= new Date(DEADLINE_ISO);
}

export const UCANSIGN_URL = process.env.NEXT_PUBLIC_UCANSIGN_URL || "#";

export const APPLY_URL = "/apply";
