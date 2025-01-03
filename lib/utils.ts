import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Convert a Prisma object into a regular js object
export function convertToPlainObject<T>(object: T): T {
  return JSON.parse(JSON.stringify(object));
}