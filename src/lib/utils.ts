import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert HSL object to string format used in CSS variables
 */
export function HSLToString(hsl: { h: number; s: number; l: number }): string {
  return `${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%`;
}

/**
 * Convert HSL string from CSS variables to object format for color picker
 */
export function stringToHSL(hslString: string): { h: number; s: number; l: number } {
  const [h, s, l] = hslString.split(' ').map(part => {
    // Remove % if present and convert to number
    return parseFloat(part.replace('%', ''));
  });
  
  return { h, s, l };
}
