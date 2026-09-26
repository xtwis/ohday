import type { OhDayFlag } from "./const"
import { DAY_OF_MONTH, FLAG_DATE, FLAG_MS, FLAG_WEEK, FLAGS } from "./const"

/**
 * @description Get the index of a time flag in the FLAGS array
 */
export function getFlagIndex(f: OhDayFlag): number {
  return FLAGS.indexOf(f === FLAG_WEEK ? FLAG_DATE : f)
}

/**
 * @description Get the time flag by its index
 */
export function getFlagByIndex(index: number): OhDayFlag {
  return FLAGS[index] ?? FLAG_MS
}

/**
 * @description Get the corresponding value by flag
 * @param f - Time flag
 * @param cases - Array of values
 * @param def - Default value
 */
export function flag<T>(f: OhDayFlag, cases: T[], def: T): T {
  return cases[getFlagIndex(f)] ?? def
}

/**
 * @description Check if a year is a leap year
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * @description Get the number of days in a month
 */
export function daysOfMonth(year: number, month: number): number {
  if (month === 2 && isLeapYear(year))
    return 29
  return DAY_OF_MONTH[month - 1]
}

/**
 * @description Escape special characters in a string for use in a RegExp
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * @description Tagged template alias for String.raw
 */
export const raw: typeof String.raw = String.raw

/**
 * @description Alias for Number — type coercion to number
 */
export const toNum = Number

/**
 * @description Pad a number with leading zeros to the specified length
 * @param value - The number to pad
 * @param length - Target string length (defaults to no padding)
 */
export function padStart(value: number, length?: number): string {
  if (!length)
    return String(value)
  return String(value).padStart(length, "0")
}
