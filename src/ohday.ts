import type { OhDayFlag } from "./const"
import type { OhDayLike } from "./format"
import { DAY_A_MONTH, DAY_A_YEAR, DEFAULT_FORMAT, FLAG_DATE, FLAG_MONTH, FLAG_MS, FLAG_WEEK, FLAG_YEAR, MS_A_DAY, MS_A_HOUR, MS_A_MINUTE, MS_A_SECOND, MS_A_WEEK, OBJECT_KEY_DATE, OBJECT_KEY_HOUR, OBJECT_KEY_MINUTE, OBJECT_KEY_MONTH, OBJECT_KEY_MS, OBJECT_KEY_SECOND, OBJECT_KEY_YEAR } from "./const"
import { formatDate, parseInput } from "./format"
import { daysOfMonth, flag, getFlagByIndex, getFlagIndex } from "./util"

export { OhDayFlag } from "./const"
export { OhDayLike } from "./format"

/**
 * @description Factory function type for creating OhDay instances.
 * @see https://x.twis.uk/en/ohday/reference/types.html#ohdayfactory
 */
export interface OhDayFactory {
  (input?: OhDayLike, format?: string): OhDay
  /**
   * @description Install an OhDay plugin to extend functionality.
   * @see https://x.twis.uk/en/ohday/reference/types.html#ohdayfactory
   */
  use: (plugin: OhDayPlugin) => OhDayFactory
}

/**
 * @description Plugin function type for OhDay extensions. The `$i` flag marks whether the plugin has been installed.
 * @see https://x.twis.uk/en/ohday/reference/types.html#ohdayplugin
 */
export type OhDayPlugin = ((instance: typeof OhDay, factory: OhDayFactory) => void) & { $i?: boolean }

/**
 * @description Date/time processing class. Wraps a `Date` and provides the full API.
 * @see https://x.twis.uk/en/ohday/reference/ohday.html
 */
export class OhDay {
  readonly $d: Date

  /**
   * @description Create an OhDay instance from any `OhDayLike` input.
   * @see https://x.twis.uk/en/ohday/reference/ohday.html#constructor
   */
  constructor(input?: OhDayLike, format?: string) {
    this.$d = parseInput(input, format)
  }

  // region Information
  /**
   * @description Default formatted string in `YYYY-MM-DD HH:mm:ss` format.
   * @see https://x.twis.uk/en/ohday/guide/output.html#getters
   */
  get s(): string {
    return formatDate(this.$d, DEFAULT_FORMAT)
  }

  /**
   * @description ISO 8601 formatted string.
   * @see https://x.twis.uk/en/ohday/guide/output.html#getters
   */
  get iso(): string {
    return this.$d.toISOString()
  }

  /**
   * @description Unix timestamp in milliseconds.
   * @see https://x.twis.uk/en/ohday/guide/output.html#getters
   */
  get ts(): number {
    return this.$d.getTime()
  }

  /**
   * @description JavaScript `Date` clone of the internal value.
   * @see https://x.twis.uk/en/ohday/guide/output.html#getters
   */
  get dd(): Date {
    return new Date(this.$d)
  }

  /**
   * @description Year (e.g. `2023`).
   * @see https://x.twis.uk/en/ohday/guide/output.html#getters
   */
  get year(): number {
    return this.$d.getFullYear()
  }

  /**
   * @description Month, 1 to 12.
   * @see https://x.twis.uk/en/ohday/guide/output.html#getters
   */
  get month(): number {
    return this.$d.getMonth() + 1
  }

  /**
   * @description Day of month, 1 to 31.
   * @see https://x.twis.uk/en/ohday/guide/output.html#getters
   */
  get date(): number {
    return this.$d.getDate()
  }

  /**
   * @description Day of week, 0 (Sun) to 6 (Sat).
   * @see https://x.twis.uk/en/ohday/guide/output.html#getters
   */
  get day(): number {
    return this.$d.getDay()
  }

  /**
   * @description Hour, 0 to 23.
   * @see https://x.twis.uk/en/ohday/guide/output.html#getters
   */
  get hour(): number {
    return this.$d.getHours()
  }

  /**
   * @description Minute, 0 to 59.
   * @see https://x.twis.uk/en/ohday/guide/output.html#getters
   */
  get minute(): number {
    return this.$d.getMinutes()
  }

  /**
   * @description Second, 0 to 59.
   * @see https://x.twis.uk/en/ohday/guide/output.html#getters
   */
  get second(): number {
    return this.$d.getSeconds()
  }

  /**
   * @description Millisecond, 0 to 999.
   * @see https://x.twis.uk/en/ohday/guide/output.html#getters
   */
  get ms(): number {
    return this.$d.getMilliseconds()
  }

  /**
   * @description Clone of self.
   * @see https://x.twis.uk/en/ohday/guide/output.html#getters
   */
  get od(): OhDay {
    return new OhDay(this)
  }

  /**
   * @description General getter; returns the value at the given scope, or the timestamp without one.
   * @see https://x.twis.uk/en/ohday/reference/ohday.html#gscope
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
   * @description Change the field at the given scope.
   * @see https://x.twis.uk/en/ohday/guide/change.html
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
   * @description Change to the start of the given scope.
   * @see https://x.twis.uk/en/ohday/guide/change.html
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
   * @description Change to the end of the given scope.
   * @see https://x.twis.uk/en/ohday/guide/change.html
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
   * @description Add an offset to the given scope.
   * @see https://x.twis.uk/en/ohday/guide/calculate.html
   */
  add(scope: OhDayFlag, offset: number): OhDay {
    if (scope === FLAG_WEEK)
      return this.add("d", offset * 7)
    return this.c(scope, this.g(scope) + offset)
  }

  /**
   * @description Subtract an offset from the given scope.
   * @see https://x.twis.uk/en/ohday/guide/calculate.html
   */
  sub(scope: OhDayFlag, offset: number): OhDay {
    return this.add(scope, -offset)
  }

  /**
   * @description Difference between current and target, in the given unit.
   * @see https://x.twis.uk/en/ohday/guide/calculate.html
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
   * @description Length of the field at the given scope, in the given unit.
   * @see https://x.twis.uk/en/ohday/guide/calculate.html
   */
  len(scope: OhDayFlag, unit?: OhDayFlag, float?: boolean): number {
    const s = this.cs(scope)
    const e = s.add(scope, 1)
    return e.diff(s, unit, float)
  }
  // endregion

  // region Comparison
  /**
   * @description Equal to the target at the given scope.
   * @see https://x.twis.uk/en/ohday/guide/compare.html
   */
  eq(target: OhDayLike, scope?: OhDayFlag): boolean {
    return this._cmp(target, scope) === 0
  }

  /**
   * @description Less than the target at the given scope.
   * @see https://x.twis.uk/en/ohday/guide/compare.html
   */
  lt(target: OhDayLike, scope?: OhDayFlag): boolean {
    return this._cmp(target, scope) < 0
  }

  /**
   * @description Greater than the target at the given scope.
   * @see https://x.twis.uk/en/ohday/guide/compare.html
   */
  gt(target: OhDayLike, scope?: OhDayFlag): boolean {
    return this._cmp(target, scope) > 0
  }

  /**
   * @description Less than or equal to the target at the given scope.
   * @see https://x.twis.uk/en/ohday/guide/compare.html
   */
  le(target: OhDayLike, scope?: OhDayFlag): boolean {
    return this._cmp(target, scope) <= 0
  }

  /**
   * @description Greater than or equal to the target at the given scope.
   * @see https://x.twis.uk/en/ohday/guide/compare.html
   */
  ge(target: OhDayLike, scope?: OhDayFlag): boolean {
    return this._cmp(target, scope) >= 0
  }

  /**
   * @description Between `target1` and `target2`, inclusive start and exclusive end.
   * @see https://x.twis.uk/en/ohday/guide/compare.html
   */
  bt(target1: OhDayLike, target2: OhDayLike, scope?: OhDayFlag): boolean {
    return this.ge(target1, scope) && this.lt(target2, scope)
  }
  // endregion

  // region Output
  /**
   * @description Print as a formatted string using the given format.
   * @see https://x.twis.uk/en/ohday/guide/output.html
   */
  p(format?: string): string {
    return formatDate(this.$d, format || DEFAULT_FORMAT)
  }

  /**
   * @description Print as an array at the given precision.
   * @see https://x.twis.uk/en/ohday/guide/output.html
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
   * @description Print as an object at the given precision.
   * @see https://x.twis.uk/en/ohday/guide/output.html
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
   * @description Print as a `Date` object at the given precision.
   * @see https://x.twis.uk/en/ohday/guide/output.html
   */
  pd(scope?: OhDayFlag): Date {
    const arr = this.pa(scope)
    return parseInput(arr)
  }
  // endregion

  // region private
  /**
   * @description Internal comparator used by comparison methods.
   */
  private _cmp(target: OhDayLike, scope?: OhDayFlag): number {
    return this.cs(scope ?? "ms").ts - new OhDay(parseInput(target)).cs(scope ?? "ms").ts
  }
  // endregion
}

/**
 * @description Factory function for creating OhDay instances.
 * @see https://x.twis.uk/en/ohday/reference/ohday.html#odinput-format
 */
export const od = ((input?: OhDayLike, format?: string): OhDay => {
  return new OhDay(input, format)
}) as OhDayFactory

/**
 * @description Install a plugin.
 * @see https://x.twis.uk/en/ohday/reference/ohday.html#oduselugin
 */
od.use = (plugin: OhDayPlugin) => {
  if (!plugin.$i) {
    plugin(OhDay, od)
    plugin.$i = true
  }
  return od
}
