import type { OhDayFlag } from "./const"
import type { OhDayLike } from "./format"
import { DAY_A_MONTH, DAY_A_YEAR, DEFAULT_FORMAT, FLAG_DATE, FLAG_MONTH, FLAG_MS, FLAG_WEEK, FLAG_YEAR, MS_A_DAY, MS_A_HOUR, MS_A_MINUTE, MS_A_SECOND, MS_A_WEEK, OBJECT_KEY_DATE, OBJECT_KEY_HOUR, OBJECT_KEY_MINUTE, OBJECT_KEY_MONTH, OBJECT_KEY_MS, OBJECT_KEY_SECOND, OBJECT_KEY_YEAR } from "./const"
import { formatDate, parseInput } from "./format"
import { daysOfMonth, flag, getFlagByIndex, getFlagIndex } from "./util"

export { OhDayFlag } from "./const"
export { OhDayLike } from "./format"

/**
 * Factory function type for creating OhDay instances. Extendable via `declare module` for plugins.
 */
export interface OhDayFactory {
  (input?: OhDayLike, format?: string): OhDay
  /**
   * Install an OhDay plugin to extend functionality
   */
  use: (plugin: OhDayPlugin) => OhDayFactory
}

/**
 * @description Plugin function type for OhDay extensions. Receives OhDay class and od factory.
 *   - The `$i` flag marks whether the plugin has been installed, preventing duplicate installation
 */
export type OhDayPlugin = ((instance: typeof OhDay, factory: OhDayFactory) => void) & { $i?: boolean }

/**
 * @description OhDay class, supports parsing, manipulation, calculation, comparison and output methods for date/time processing
 */
export class OhDay {
  readonly $d: Date

  /**
   * @description OhDay constructor, creates a new OhDay instance
   * @param input - Time input that can be parsed by OhDay, including Date, string, timestamp, number array and object
   * @param format - Optional format string for parsing time string
   */
  constructor(input?: OhDayLike, format?: string) {
    this.$d = parseInput(input, format)
  }

  // region Information
  /**
   * @description Get the default formatted string in "YYYY-MM-DD HH:mm:ss" format
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").s // "2023-10-01 12:30:45"
   * ```
   */
  get s(): string {
    return formatDate(this.$d, DEFAULT_FORMAT)
  }

  /**
   * @description Get the ISO 8601 formatted string in "YYYY-MM-DDTHH:mm:ss.sssZ" format
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").iso // "2023-10-01T04:30:45Z"
   * ```
   */
  get iso(): string {
    return this.$d.toISOString()
  }

  /**
   * @description Get the timestamp in milliseconds
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").ts // 1696159845000
   * ```
   */
  get ts(): number {
    return this.$d.getTime()
  }

  /**
   * @description Get the Date object
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").dd // Date object
   * ```
   */
  get dd(): Date {
    return new Date(this.$d)
  }

  /**
   * @description Get the year number
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").year // 2023
   * ```
   */
  get year(): number {
    return this.$d.getFullYear()
  }

  /**
   * @description Get the month number, range 1-12
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").month // 10
   * ```
   */
  get month(): number {
    return this.$d.getMonth() + 1
  }

  /**
   * @description Get the date number, range 1-31
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").date // 1
   * ```
   */
  get date(): number {
    return this.$d.getDate()
  }

  /**
   * @description Get the day of week, range 0-6, where 0 represents Sunday
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").day // 0
   * ```
   */
  get day(): number {
    return this.$d.getDay()
  }

  /**
   * @description Get the hour number, range 0-23
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").hour // 12
   * ```
   */
  get hour(): number {
    return this.$d.getHours()
  }

  /**
   * @description Get the minute number, range 0-59
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").minute // 30
   * ```
   */
  get minute(): number {
    return this.$d.getMinutes()
  }

  /**
   * @description Get the second number, range 0-59
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").second // 45
   * ```
   */
  get second(): number {
    return this.$d.getSeconds()
  }

  /**
   * @description Get the millisecond number, range 0-999
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").ms // 678
   * ```
   */
  get ms(): number {
    return this.$d.getMilliseconds()
  }

  /**
   * @description Get a clone of the current OhDay instance
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").od // OhDay instance
   * ```
   */
  get od(): OhDay {
    return new OhDay(this)
  }

  /**
   * @description Get the value of a specified time field. Returns day of week (0-6) for "w", returns timestamp if no argument
   * @example
   * ```ts
   * od("2023-10-01 12:30:45").g("y") // 2023
   * ```
   */
  g(scope?: OhDayFlag): number {
    return scope === undefined
      ? this.ts
      : scope === FLAG_WEEK
        ? this.day
        : flag(scope, [
            this.year,
            this.month,
            this.date,
            this.hour,
            this.minute,
            this.second,
            this.ms,
          ], this.ms)
  }
  // endregion

  // region Manipulation
  /**
   * @description Change the value of a specified time field, returns a new OhDay instance
   *   - When date overflow occurs, automatically adjusts to the last day of the month
   * @param scope - The time field to modify
   * @param value - The new time value
   * @example
   * ```ts
   * // Change year to 2025
   * od("2023-10-01 12:30:45").c("y", 2025).s // "2025-10-01 12:30:45"
   * ```
   */
  c(scope: OhDayFlag, value: number): OhDay {
    const d = new Date(this.$d)
    if (scope === FLAG_WEEK)
      return this.c("d", this.date + (value - this.day))

    const date = d.getDate()
    flag(scope, [
      () => d.setFullYear(value),
      () => d.setMonth(value - 1),
      () => d.setDate(value),
      () => d.setHours(value),
      () => d.setMinutes(value),
      () => d.setSeconds(value),
      () => d.setMilliseconds(value),
    ], () => {})()

    if ((scope === FLAG_YEAR || scope === FLAG_MONTH) && d.getDate() !== date) {
      d.setDate(0)
    }
    return new OhDay(d)
  }

  /**
   * @description Change to the start of the specified time field with given value, returns a new OhDay instance
   * @param scope - The time field to modify
   * @param value - The new time value, defaults to current value
   * @example
   * ```ts
   * // Change to the start of February
   * od("2023-10-01 12:30:45").cs("M", 2).s // "2023-02-01 00:00:00"
   * ```
   */
  cs(scope: OhDayFlag, value?: number): OhDay {
    if (scope === FLAG_WEEK)
      return this.c("w", value ?? 0).cs("d")

    let d = value ? this.c(scope, value) : this
    const h = getFlagIndex(scope)
    for (let i = h + 1; i < 7; i++) {
      const s = getFlagByIndex(i)
      d = d.c(s, s === FLAG_MONTH || s === FLAG_DATE ? 1 : 0)
    }
    return d
  }

  /**
   * @description Change to the end of the specified time field with given value, returns a new OhDay instance
   * @param scope - The time field to modify
   * @param value - The new time value, defaults to current value
   * @example
   * ```ts
   * // Change to the end of February
   * od("2023-10-01 12:30:45").ce("M", 2).s // "2023-02-28 23:59:59"
   * ```
   */
  ce(scope: OhDayFlag, value?: number): OhDay {
    if (scope === FLAG_WEEK)
      return this.c("w", value ?? 6).ce("d")

    let d = value ? this.c(scope, value) : this
    const h = getFlagIndex(scope)
    for (let i = h + 1; i < 7; i++) {
      const s = getFlagByIndex(i)
      d = d.c(s, flag(s, [
        9999, // never reaches this branch
        12, // only reaches this branch when modifying year
        daysOfMonth(d.year, d.month),
        23,
        59,
        59,
        999,
      ], 0))
    }
    return d
  }
  // endregion

  // region Calculation
  /**
   * @description Add an offset to the specified time field, returns a new OhDay instance
   *   - When date overflow occurs, automatically adjusts to the last day of the month
   * @param scope - The time field to modify
   * @param offset - The offset amount, can be positive or negative
   * @example
   * ```ts
   * // Add 1 year to the current time
   * od("2023-10-01 12:30:45").add("y", 1).s // "2024-10-01 12:30:45"
   * ```
   */
  add(scope: OhDayFlag, offset: number): OhDay {
    if (scope === FLAG_WEEK)
      return this.add("d", offset * 7)
    return this.c(scope, this.g(scope) + offset)
  }

  /**
   * @description Subtract an offset from the specified time field, returns a new OhDay instance
   *   - When date overflow occurs, automatically adjusts to the last day of the month
   * @param scope - The time field to modify
   * @param offset - The offset amount, can be positive or negative
   * @example
   * ```ts
   * // Subtract 1 year from the current time
   * od("2023-10-01 12:30:45").sub("y", 1).s // "2022-10-01 12:30:45"
   * ```
   */
  sub(scope: OhDayFlag, offset: number): OhDay {
    return this.add(scope, -offset)
  }

  /**
   * @description Calculate the difference between the current and target time, returns a number in the specified unit
   * @param target - Target time, supports multiple input types
   * @param unit - The return value unit, defaults to millisecond
   * @param float - Whether to return a float value, defaults to false
   * @example
   * ```ts
   * // Calculate the difference in days
   * od("2023-10-01 12:30:45").diff("2022-10-01 12:30:45", "d") // 365
   * ```
   */
  diff(target: OhDayLike, unit?: OhDayFlag, float?: boolean): number {
    const that = new OhDay(parseInput(target))
    const diffMs = this.ts - that.ts

    const diffYears = this.year - that.year
    const diffMonths = (this.year - that.year) * 12 + (this.month - that.month)

    if (unit === FLAG_WEEK)
      return float ? diffMs / MS_A_WEEK : Math.trunc(diffMs / MS_A_WEEK)

    return flag(unit ?? FLAG_MS, [
      // Correct when ms diff and year diff share the same sign: subtract 1 for positive, add 1 for negative
      float ? diffMs / (MS_A_DAY * DAY_A_YEAR) : diffYears + (diffMs * (that.add("y", diffYears).ts - this.ts) > 0 ? diffMs > 0 ? -1 : 1 : 0),
      float ? diffMs / (MS_A_DAY * DAY_A_MONTH) : diffMonths + (diffMs * (that.add("M", diffMonths).ts - this.ts) > 0 ? diffMs > 0 ? -1 : 1 : 0),
      // Use truncation toward zero to handle both positive and negative correctly
      float ? diffMs / MS_A_DAY : Math.trunc(diffMs / MS_A_DAY),
      float ? diffMs / MS_A_HOUR : Math.trunc(diffMs / MS_A_HOUR),
      float ? diffMs / MS_A_MINUTE : Math.trunc(diffMs / MS_A_MINUTE),
      float ? diffMs / MS_A_SECOND : Math.trunc(diffMs / MS_A_SECOND),
      diffMs,
    ], diffMs)
  }

  /**
   * @description Calculate the length of a specified time field in the given unit, returns a number
   * @param scope - The time field
   * @param unit - The return value unit
   * @param float - Whether to return a float value, defaults to false
   * @example
   * ```ts
   * // Calculate the length of a month in days
   * od("2023-10-01 12:30:45").len("M", "d") // 31
   * ```
   */
  len(scope: OhDayFlag, unit?: OhDayFlag, float?: boolean): number {
    const s = this.cs(scope)
    const e = s.add(scope, 1)
    return e.diff(s, unit, float)
  }
  // endregion

  // region Comparison
  /**
   * @description Check if the current time equals the target time in the specified field
   * @param target - Target time, supports multiple input types
   * @param scope - The comparison field, defaults to millisecond
   * @example
   * ```ts
   * // Compare by day
   * od("2023-10-01 12:30:45").eq("2023-10-01 00:00:00", "d") // true
   * ```
   */
  eq(target: OhDayLike, scope?: OhDayFlag): boolean {
    return this._cmp(target, scope) === 0
  }

  /**
   * @description Check if the current time is less than the target time in the specified field
   * @param target - Target time, supports multiple input types
   * @param scope - The comparison field, defaults to millisecond
   * @example
   * ```ts
   * // Compare by day
   * od("2023-10-01 12:30:45").lt("2023-10-02 00:00:00", "d") // true
   * ```
   */
  lt(target: OhDayLike, scope?: OhDayFlag): boolean {
    return this._cmp(target, scope) < 0
  }

  /**
   * @description Check if the current time is greater than the target time in the specified field
   * @param target - Target time, supports multiple input types
   * @param scope - The comparison field, defaults to millisecond
   * @example
   * ```ts
   * // Compare by day
   * od("2023-10-01 12:30:45").gt("2034-09-30 00:00:00", "d") // true
   * ```
   */
  gt(target: OhDayLike, scope?: OhDayFlag): boolean {
    return this._cmp(target, scope) > 0
  }

  /**
   * @description Check if the current time is less than or equal to the target time in the specified field
   * @param target - Target time, supports multiple input types
   * @param scope - The comparison field, defaults to millisecond
   * @example
   * ```ts
   * // Compare by day
   * od("2023-10-01 12:30:45").le("2023-10-02 00:00:00", "d") // true
   * ```
   */
  le(target: OhDayLike, scope?: OhDayFlag): boolean {
    return this._cmp(target, scope) <= 0
  }

  /**
   * @description Check if the current time is greater than or equal to the target time in the specified field
   * @param target - Target time, supports multiple input types
   * @param scope - The comparison field, defaults to millisecond
   * @example
   * ```ts
   * // Compare by day
   * od("2026-01-02 12:00:00").ge("2026-01-01 00:00:00", "d") // true
   * ```
   */
  ge(target: OhDayLike, scope?: OhDayFlag): boolean {
    return this._cmp(target, scope) >= 0
  }

  /**
   * @description Check if the current time is between two target times, returns a boolean
   *   - Default comparison range is [target1, target2)
   * @param target1 - Start of the comparison range, supports multiple input types
   * @param target2 - End of the comparison range, supports multiple input types
   * @param scope - The comparison field, defaults to millisecond
   * @example
   * ```ts
   * // Check if current time is between two dates by day
   * od("2023-10-01 12:30:45").bt("2023-09-30 00:00:00", "2023-10-02 00:00:00", "d") // true
   * ```
   */
  bt(target1: OhDayLike, target2: OhDayLike, scope?: OhDayFlag): boolean {
    return this.ge(target1, scope) && this.lt(target2, scope)
  }
  // endregion

  // region Output
  /**
   * @description Format the current OhDay instance as a string in the specified format
   * @param format - The output format string, defaults to "YYYY-MM-DD HH:mm:ss"
   * @example
   * ```ts
   * // Format current time as "YYYY/MM/DD"
   * od("2023-10-01 12:30:45").p("YYYY/MM/DD") // "2023/10/01"
   * ```
   */
  p(format?: string): string {
    return formatDate(this.$d, format || DEFAULT_FORMAT)
  }

  /**
   * @description Print the current OhDay instance as an array at the specified precision
   * @param scope - The output precision, defaults to millisecond
   * @example
   * ```ts
   * // Print current time at day precision
   * od("2023-10-01 12:30:45").pa("d") // [2023, 10, 1]
   * ```
   */
  pa(scope?: OhDayFlag): number[] {
    const arr = []
    const l = getFlagIndex(scope ?? FLAG_MS)
    for (let i = 0; i <= l; i++) {
      const s = getFlagByIndex(i)
      arr.push(this.g(s))
    }
    return arr
  }

  /**
   * @description Print the current OhDay instance as an object at the specified precision
   * @param scope - The output precision, defaults to millisecond
   * @example
   * ```ts
   * // Print current time at day precision
   * od("2023-10-01 12:30:45").po("d") // { year: 2023, month: 10, date: 1 }
   * ```
   */
  po(scope?: OhDayFlag): Record<string, number> {
    let obj = {}
    const l = getFlagIndex(scope ?? FLAG_MS)
    for (let i = 0; i <= l; i++) {
      const s = getFlagByIndex(i)
      const key = ([
        OBJECT_KEY_YEAR,
        OBJECT_KEY_MONTH,
        OBJECT_KEY_DATE,
        OBJECT_KEY_HOUR,
        OBJECT_KEY_MINUTE,
        OBJECT_KEY_SECOND,
        OBJECT_KEY_MS,
      ] as const)[i]
      obj = { ...obj, [key]: this.g(s) }
    }
    return obj
  }

  /**
   * @description Print the current OhDay instance as a Date object at the specified precision
   * @param scope - The output precision, defaults to millisecond
   * @example
   * ```ts
   * // Print current time at day precision as Date object
   * od("2023-10-01 12:30:45").pd("d") // Date object
   * ```
   */
  pd(scope?: OhDayFlag): Date {
    const arr = this.pa(scope)
    return parseInput(arr)
  }
  // endregion

  // region private
  /**
   * @description Align both the current and target times to the start of the specified field, then compute the timestamp difference.
   *   Used internally by comparison methods to avoid the truncation ambiguity of diff() on negative sub-unit values.
   * @param target - Target time, supports multiple input types
   * @param scope - The comparison field, defaults to millisecond
   * @example
   * ```ts
   * // Compare by day
   * od("2023-10-01 12:30:45")._cmp("2023-10-02 00:00:00", "d") // -86400000
   * ```
   */
  private _cmp(target: OhDayLike, scope?: OhDayFlag): number {
    return this.cs(scope ?? "ms").ts - new OhDay(parseInput(target)).cs(scope ?? "ms").ts
  }
  // endregion
}

/**
 * @description Factory function to create a new OhDay instance
 * @param input - Time input that can be parsed by OhDay, including Date, string, timestamp, number array and object
 * @param format - Optional format string for parsing time string
 * @example
 * ```ts
 * // Create a new OhDay instance
 * od("2023-10-01 12:30:45") // OhDay instance
 * ```
 */
export const od = ((input?: OhDayLike, format?: string): OhDay => {
  return new OhDay(input, format)
}) as OhDayFactory

od.use = (plugin: OhDayPlugin) => {
  if (!plugin.$i) {
    plugin(OhDay, od)
    plugin.$i = true
  }
  return od
}
