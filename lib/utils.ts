import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertSupabaseDateToHumanReadable(date: string) {
  const parsedDate = new Date(date);
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  // @ts-ignore
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(parsedDate);
  return formattedDate;
}

export function getSupabaseImagePath(castName: string, castId: number) {
  return castName + '/' + castId;
}