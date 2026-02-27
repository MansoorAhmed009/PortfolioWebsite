import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(value);
}

export function readingTimeFromText(input: string) {
  const words = input.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}
