import { raw } from "./util"

// region Time Flags
/**
 * @description Flag type for marking time fields or units
 */
export type OhDayFlag = "y" | "M" | "w" | "d" | "h" | "m" | "s" | "ms"

export const FLAG_YEAR = "y"
export const FLAG_MONTH = "M"
export const FLAG_WEEK = "w"
export const FLAG_DATE = "d"
export const FLAG_HOUR = "h"
export const FLAG_MINUTE = "m"
export const FLAG_SECOND = "s"
export const FLAG_MS = "ms"

export const FLAGS = [
  FLAG_YEAR,
  FLAG_MONTH,
  FLAG_DATE,
  FLAG_HOUR,
  FLAG_MINUTE,
  FLAG_SECOND,
  FLAG_MS,
] as const
// endregion

// region Time Lengths
export const SECOND_A_MINUTE = 60
export const SECOND_A_HOUR = SECOND_A_MINUTE * 60
export const SECOND_A_DAY = SECOND_A_HOUR * 24
export const DAY_A_MONTH = 30.4375
export const DAY_A_YEAR = 365.25
export const MS_A_SECOND = 1e3
export const MS_A_MINUTE = SECOND_A_MINUTE * MS_A_SECOND
export const MS_A_HOUR = SECOND_A_HOUR * MS_A_SECOND
export const MS_A_DAY = SECOND_A_DAY * MS_A_SECOND
export const MS_A_WEEK = MS_A_DAY * 7

export const DAY_OF_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const
// endregion

// region Format Tokens And Object Keys
export const FORMAT_TOKEN_YYYY = "YYYY"
export const FORMAT_TOKEN_YY = "YY"
export const FORMAT_TOKEN_MM = "MM"
export const FORMAT_TOKEN_M = "M"
export const FORMAT_TOKEN_DD = "DD"
export const FORMAT_TOKEN_D = "D"
export const FORMAT_TOKEN_HH = "HH"
export const FORMAT_TOKEN_H = "H"
export const FORMAT_TOKEN_mm = "mm"
export const FORMAT_TOKEN_m = "m"
export const FORMAT_TOKEN_ss = "ss"
export const FORMAT_TOKEN_s = "s"
export const FORMAT_TOKEN_SSS = "SSS"

export const OBJECT_KEY_YEAR = "year"
export const OBJECT_KEY_MONTH = "month"
export const OBJECT_KEY_DATE = "date"
export const OBJECT_KEY_HOUR = "hour"
export const OBJECT_KEY_MINUTE = "minute"
export const OBJECT_KEY_SECOND = "second"
export const OBJECT_KEY_MS = "ms"

export const OBJECT_KEYS = [
  OBJECT_KEY_YEAR,
  OBJECT_KEY_MONTH,
  OBJECT_KEY_DATE,
  OBJECT_KEY_HOUR,
  OBJECT_KEY_MINUTE,
  OBJECT_KEY_SECOND,
  OBJECT_KEY_MS,
] as const
// endregion

// region Date Formatting
export const DEFAULT_FORMAT = "YYYY-MM-DD HH:mm:ss"

export const REGEX_DIGITS = /\d+/g
export const REGEX_DATE_SEP = /[-/]/
export const REGEX_TIME_SEP = /:/

const REGEX_DIGIT_4 = raw`(\d{4})`
const REGEX_DIGIT_2 = raw`(\d{2})`
const REGEX_DIGIT_3 = raw`(\d{3})`
const REGEX_DIGIT_1_2 = raw`(\d{1,2})`

export const FORMAT_TOKEN_REGEX_MAP: Record<string, string> = {
  [FORMAT_TOKEN_YYYY]: REGEX_DIGIT_4,
  [FORMAT_TOKEN_YY]: REGEX_DIGIT_2,
  [FORMAT_TOKEN_SSS]: REGEX_DIGIT_3,
  [FORMAT_TOKEN_MM]: REGEX_DIGIT_2,
  [FORMAT_TOKEN_DD]: REGEX_DIGIT_2,
  [FORMAT_TOKEN_HH]: REGEX_DIGIT_2,
  [FORMAT_TOKEN_mm]: REGEX_DIGIT_2,
  [FORMAT_TOKEN_ss]: REGEX_DIGIT_2,
  [FORMAT_TOKEN_M]: REGEX_DIGIT_1_2,
  [FORMAT_TOKEN_D]: REGEX_DIGIT_1_2,
  [FORMAT_TOKEN_H]: REGEX_DIGIT_1_2,
  [FORMAT_TOKEN_m]: REGEX_DIGIT_1_2,
  [FORMAT_TOKEN_s]: REGEX_DIGIT_1_2,
}

export const FORMAT_TOKEN_KEY_MAP: Record<string, string> = {
  [FORMAT_TOKEN_YYYY]: OBJECT_KEY_YEAR,
  [FORMAT_TOKEN_YY]: OBJECT_KEY_YEAR,
  [FORMAT_TOKEN_SSS]: OBJECT_KEY_MS,
  [FORMAT_TOKEN_MM]: OBJECT_KEY_MONTH,
  [FORMAT_TOKEN_DD]: OBJECT_KEY_DATE,
  [FORMAT_TOKEN_HH]: OBJECT_KEY_HOUR,
  [FORMAT_TOKEN_mm]: OBJECT_KEY_MINUTE,
  [FORMAT_TOKEN_ss]: OBJECT_KEY_SECOND,
  [FORMAT_TOKEN_M]: OBJECT_KEY_MONTH,
  [FORMAT_TOKEN_D]: OBJECT_KEY_DATE,
  [FORMAT_TOKEN_H]: OBJECT_KEY_HOUR,
  [FORMAT_TOKEN_m]: OBJECT_KEY_MINUTE,
  [FORMAT_TOKEN_s]: OBJECT_KEY_SECOND,
}
// endregion
