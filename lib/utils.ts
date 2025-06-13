import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { EnvironmentVariable } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function substituteEnvVars(text: string, variables: EnvironmentVariable[]): string {
  if (!text) return text

  let result = text

  variables.forEach((variable) => {
    const regex = new RegExp(`{{${variable.key}}}`, "g")
    result = result.replace(regex, variable.value)
  })

  return result
}
