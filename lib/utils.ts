import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date and time
export const formatFullDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const formatShortTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

// Generate a thoughtful greeting based on time of day
export const getGreeting = (date: Date): string => {
  const hour = date.getHours();
  if (hour < 12) return "Ready to shepherd this morning?";
  if (hour < 17) return "It's a good day to shepherd well.";
  return "Evening reflections await you.";
};
