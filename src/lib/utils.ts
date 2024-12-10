import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fix the base URL format by removing the extra colon
export const BASE_URL = "https://480ee6eb-9ae6-49ea-aa47-108554f88d54.lovableproject.com";

// Add a helper function to ensure proper URL formatting
export function getApiUrl(path: string) {
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// Add console logging to help debug URL issues
export function logApiCall(url: string) {
  console.log('API Call URL:', url);
}