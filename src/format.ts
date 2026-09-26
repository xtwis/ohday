import {
  DEFAULT_FORMAT,
  FORMAT_TOKEN_D,
  FORMAT_TOKEN_DD,
  FORMAT_TOKEN_H,
  FORMAT_TOKEN_HH,
  FORMAT_TOKEN_KEY_MAP,
  FORMAT_TOKEN_M,
  FORMAT_TOKEN_m,
  FORMAT_TOKEN_MM,
  FORMAT_TOKEN_mm,
  FORMAT_TOKEN_REGEX_MAP,
  FORMAT_TOKEN_s,
  FORMAT_TOKEN_ss,
  FORMAT_TOKEN_SSS,
  FORMAT_TOKEN_YY,
  FORMAT_TOKEN_YYYY,
  OBJECT_KEYS,
  REGEX_DATE_SEP,
  REGEX_DIGITS,
  REGEX_TIME_SEP,
} from "./const"
import { OhDay } from "./ohday"
import { escapeRegExp, padStart, toNum } from "./util"

/**
 * @description Acceptable time input types, including Date, OhDay, string, timestamp, number array and object
 */
export type OhDayLike = Date | OhDay | string | number | number[] | {
  year?: number
  month?: number
  date?: number
  day?: number
  hour?: number
  minute?: number
  second?: number
  ms?: number
}

/**
 * @description Parse a string into a Date object, supports custom format
 *   - Default supported formats: date separated by -, /, time separated by :, date and time separated by space, milliseconds separated by .
 */
export function parseString(input: string, format?: string): Date | null {
  // Check if a format string is provided
  if (format) {
    let pattern = "^"
    const fields: string[] = []
    let i = 0

    // Match predefined tokens one by one
    while (i < format.length) {
      let matched = false
      for (const [token, regexPart] of Object.entries(FORMAT_TOKEN_REGEX_MAP)) {
        if (format.startsWith(token, i)) {
          pattern += regexPart
          fields.push(FORMAT_TOKEN_KEY_MAP[token])

          i += token.length
          matched = true
          break
        }
      }

      // Not matched, escape special characters
      if (!matched) {
        pattern += escapeRegExp(format[i])
        i++
      }
    }

    // Match the combined regex pattern
    pattern += "$"
    const regex = new RegExp(pattern)
    const match = input.match(regex)
    if (!match)
      return null

    const values: (number | undefined)[] = Array.from({ length: OBJECT_KEYS.length })

    // Extract fields from input match
    for (let idx = 0; idx < fields.length; idx++) {
      const fieldName = fields[idx] as typeof OBJECT_KEYS[number]
      const valueStr = match[idx + 1]
      const keyIndex = OBJECT_KEYS.indexOf(fieldName)
      if (keyIndex !== -1) {
        values[keyIndex] = valueStr ? toNum(valueStr) : undefined
      }
    }

    // Pad YY to 20xx
    if (values[0] !== undefined && values[0] < 100) {
      values[0] += 2000
    }

    return complete(...values as [number | undefined, number | undefined, number | undefined, number | undefined, number | undefined, number | undefined, number | undefined])
  }
  else {
    // Check if input contains date separator
    const hasDateSep = REGEX_DATE_SEP.test(input)
    // Check if input contains time separator
    const hasTimeSep = REGEX_TIME_SEP.test(input)

    if (!hasDateSep && !hasTimeSep) {
      return null
    }
    else if (hasDateSep && hasTimeSep) {
      // Split date and time parts
      const [datePart, timePart] = input.replace("T", " ").split(/\s+/)
      const dateNums = datePart.match(REGEX_DIGITS) ?? []
      const timeNums = timePart.match(REGEX_DIGITS) ?? []

      return complete(
        toNum(dateNums[0]),
        toNum(dateNums[1]),
        toNum(dateNums[2]),
        toNum(timeNums[0]),
        toNum(timeNums[1]),
        toNum(timeNums[2]),
        timeNums[3] ? toNum(timeNums[3]) : undefined,
      )
    }
    else if (hasDateSep && !hasTimeSep) {
      const nums = input.match(REGEX_DIGITS) ?? []
      return complete(
        toNum(nums[0]),
        toNum(nums[1]),
        toNum(nums[2]),
      )
    }
    else {
      // Condition: !hasDateSep && hasTimeSep
      const nums = input.match(REGEX_DIGITS) ?? []
      return complete(
        undefined,
        undefined,
        undefined,
        toNum(nums[0]),
        toNum(nums[1]),
        toNum(nums[2]),
        nums[3] ? toNum(nums[3]) : undefined,
      )
    }
  }
}

/**
 * @description Default completion function for missing date/time fields
 *   - Time defaults to 0, lower date fields default to 1, higher date fields default to current
 *   - When all values are missing, returns current time
 */
export function complete(year?: number, month?: number, date?: number, hour?: number, minute?: number, second?: number, ms?: number): Date {
  const now = new Date()
  const hasYear = year !== undefined
  const hasMonth = month !== undefined
  const hasDate = date !== undefined

  const y = hasYear ? year! : now.getFullYear()
  const M = hasMonth ? month! : hasYear ? 1 : now.getMonth() + 1
  const d = hasDate ? date! : (hasYear || hasMonth) ? 1 : now.getDate()
  const h = hour ?? 0
  const m = minute ?? 0
  const s = second ?? 0
  const msVal = ms ?? 0

  return new Date(y, M - 1, d, h, m, s, msVal)
}

/**
 * @description Parse input into a Date object, supports Date, OhDay, string, timestamp, array and object
 */
export function parseInput(input?: OhDayLike, format?: string): Date {
  if (!input)
    return new Date()

  if (input instanceof Date)
    return new Date(input)

  if (input instanceof OhDay)
    return input.dd

  if (typeof input === "number")
    return new Date(input)

  if (typeof input === "string") {
    const d = parseString(input, format)
    return d ?? new Date(input)
  }

  if (Array.isArray(input)) {
    return complete(...input as [number | undefined, number | undefined, number | undefined, number | undefined, number | undefined, number | undefined, number | undefined])
  }

  if (typeof input === "object") {
    const obj = input as Record<string, number>
    return complete(obj.year, obj.month, obj.date, obj.hour, obj.minute, obj.second, obj.ms)
  }

  return new Date()
}

/**
 * @description Format a Date object into a string with custom format
 */
export function formatDate(date: Date, formatStr: string = DEFAULT_FORMAT): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const ms = date.getMilliseconds()

  const tokenRegex = new RegExp([
    FORMAT_TOKEN_YYYY,
    FORMAT_TOKEN_YY,
    FORMAT_TOKEN_MM,
    FORMAT_TOKEN_M,
    FORMAT_TOKEN_DD,
    FORMAT_TOKEN_D,
    FORMAT_TOKEN_HH,
    FORMAT_TOKEN_H,
    FORMAT_TOKEN_mm,
    FORMAT_TOKEN_m,
    FORMAT_TOKEN_ss,
    FORMAT_TOKEN_s,
    FORMAT_TOKEN_SSS,
  ].join("|"), "g")
  return formatStr.replace(tokenRegex, (token) => {
    switch (token) {
      case FORMAT_TOKEN_YYYY: return padStart(year)
      case FORMAT_TOKEN_YY: return padStart(year % 100, 2)
      case FORMAT_TOKEN_MM: return padStart(month, 2)
      case FORMAT_TOKEN_M: return padStart(month)
      case FORMAT_TOKEN_DD: return padStart(day, 2)
      case FORMAT_TOKEN_D: return padStart(day)
      case FORMAT_TOKEN_HH: return padStart(hour, 2)
      case FORMAT_TOKEN_H: return padStart(hour)
      case FORMAT_TOKEN_mm: return padStart(minute, 2)
      case FORMAT_TOKEN_m: return padStart(minute)
      case FORMAT_TOKEN_ss: return padStart(second, 2)
      case FORMAT_TOKEN_s: return padStart(second)
      case FORMAT_TOKEN_SSS: return padStart(ms, 3)
    }
    return token
  })
}
