import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getNextExclusiveLabel = (
  entities: Map<string, { _label: string }>,
  prefix: string
) => {
  const labels = new Set(Array.from(entities.values()).map((e) => e._label))
  let index = 1
  while (labels.has(`${prefix} ${index}`)) {
    index++
  }
  return `${prefix} ${index}`
}
