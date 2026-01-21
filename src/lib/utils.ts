import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toLiteral(value: unknown, indent = 0): string {
  const pad = (n: number) => "  ".repeat(n);

  if (value instanceof Map) {
    const entries = [...value.entries()]
      .map(
        ([k, v]) =>
          `${pad(indent + 1)}[${toLiteral(k)}, ${toLiteral(v, indent + 1)}]`,
      )
      .join(",\n");

    return `new Map([\n${entries}\n${pad(indent)}])`;
  }

  if (Array.isArray(value)) {
    return `[\n${value
      .map((v) => `${pad(indent + 1)}${toLiteral(v, indent + 1)}`)
      .join(",\n")}\n${pad(indent)}]`;
  }

  if (typeof value === "object" && value !== null) {
    const entries = Object.entries(value)
      .map(([k, v]) => `${pad(indent + 1)}${k}: ${toLiteral(v, indent + 1)}`)
      .join(",\n");

    return `{\n${entries}\n${pad(indent)}}`;
  }

  return JSON.stringify(value);
}
