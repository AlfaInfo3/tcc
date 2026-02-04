import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to generate hash for student identification
export function generateCodeHash(name: string, className: string): string {
  const crypto = require('crypto');
  return crypto
    .createHash("sha256")
    .update(name + className)
    .digest("hex");
}
