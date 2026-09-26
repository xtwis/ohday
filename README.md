# ohday - Chainable, immutable, lightweight date/time processing library.

```ts
od().c("M", 2).add("d", 10).ps("MM/DD YYYY")
```

- **Chainable API**: Concise method chaining for fluent date manipulation.
- **Immutable Design**: Every operation returns a new instance, promoting stable values and reactive-friendly patterns.
- **Tiny Bundle**: Minimal footprint comparable to dayjs, zero dependencies.
- **Short API**: Minimal character names.
- **Rich Input Support**: Support for various input types and custom format parsing.
- **TypeScript Support**: Full TypeScript definitions included.

## Getting Started

```bash
pnpm install @twisuki/ohday
```

## API

### Input

```ts
import { od } from "@twisuki/ohday"

// String parsing (auto-detect format)
od("2023-10-01 12:30:45") // "2023-10-01 12:30:45"
od("2023-10-01") // "2023-10-01 00:00:00"
od("12:30:45") // "2023-10-01 12:30:45" (today + time)
od("2023-10-01T12:30:45Z") // ISO format supported

// Custom format parsing
od("01-10-2023", "DD-MM-YYYY") // "2023-10-01 00:00:00"

// Array input: [year, month, date, hour, minute, second, ms?]
od([2023, 10, 1, 12, 30, 45]) // "2023-10-01 12:30:45"
od([2023, 10, 1]) // "2023-10-01 00:00:00"

// Object input
od({ year: 2023, month: 10, date: 1, hour: 12, minute: 30, second: 45 })
od({ year: 2023, month: 10 }) // "2023-10-01 00:00:00"
od({ hour: 12 }) // "2023-10-01 12:00:00" (today + time)

// Date object
od(new Date("2023-10-01")) // "2023-10-01 00:00:00"

// Timestamp (milliseconds)
od(1696134645000) // "2023-01-01 12:30:45"

// OhDay clone
const d = od("2023-10-01")
od(d) // returns a new instance with same date
```

### Change

```ts
// .c(scope, value) - change a specific unit to a new value
od("2023-10-01 12:30:45").c("y", 2025) // "2025-10-01 12:30:45"
od("2023-10-01 12:30:45").c("M", 2) // "2023-02-01 12:30:45"
od("2023-10-01 12:30:45").c("d", 32) // "2023-11-01 12:30:45" (auto-adjusts overflow)
od("2023-10-01 12:30:45").c("h", 0) // "2023-10-01 00:34:56"
od("2023-10-01 12:30:45").c("w", 0) // "2023-09-27 12:30:45" (jump to Sunday)
od("2023-10-01 12:30:45").c("w", 3) // "2023-09-30 12:30:45" (jump to Wednesday)

// .cs(scope, value?) - change to the start of the specified scope
od("2023-10-01 12:30:45").cs("y") // "2023-01-01 00:00:00"
od("2023-10-01 12:30:45").cs("M") // "2023-10-01 00:00:00"
od("2023-10-01 12:30:45").cs("d") // "2023-10-01 00:00:00"
od("2023-10-01 12:30:45").cs("M", 5) // "2023-05-01 00:00:00" (start of May)
od("2023-10-01 12:30:45").cs("w") // "2023-09-27 00:00:00" (start of week, Sunday)
od("2023-10-01 12:30:45").cs("w", 3) // "2023-09-30 00:00:00" (start of Wednesday)

// .ce(scope, value?) - change to the end of the specified scope
od("2023-10-01 12:30:45").ce("y") // "2023-12-31 23:59:59"
od("2023-10-01 12:30:45").ce("M") // "2023-10-31 23:59:59"
od("2023-10-01 12:30:45").ce("d") // "2023-10-01 23:59:59"
od("2023-10-01 12:30:45").ce("h", 3) // "2023-10-01 03:59:59" (end of 3 o'clock)
od("2023-10-01 12:30:45").ce("w") // "2023-10-03 23:59:59" (end of week, Saturday)
od("2023-10-01 12:30:45").ce("w", 4) // "2023-10-01 23:59:59" (end of Thursday)
```

### Calculate

```ts
// .add(scope, offset) - add offset to the specified scope
od("2023-10-01 12:30:45").add("d", 5) // "2023-10-06 12:30:45"
od("2023-10-01 12:30:45").add("M", 4) // "2024-02-01 12:30:45"
od("2023-10-01 12:30:45").add("y", -1) // "2022-10-01 12:30:45"

// .sub(scope, offset) - subtract offset from the specified scope
od("2023-10-01 12:30:45").sub("h", 15) // "2023-09-30 21:30:45"
od("2023-10-01 12:30:45").sub("M", 3) // "2023-07-01 12:30:45"
od("2023-10-01 12:30:45").add("w", 1) // "2023-10-08 12:30:45" (add 1 week)
od("2023-10-01 12:30:45").sub("w", 2) // "2023-09-17 12:30:45" (subtract 2 weeks)

// .diff(target, unit?, float?) - calculate difference between two dates in a given unit
od("2023-09-28 08:00:00").diff("2023-10-01 12:30:45", "d") // -3 (future integer days)
od("2023-09-28 08:00:00").diff("2023-10-01 12:30:45", "d", true) // -3.18... (float days)
od("2023-10-01 12:30:45").diff("2023-10-02", "d") // 0 (less then 1 day)
od("2023-10-01 12:30:45").diff("2023-10-01", "d", true) // 0.52... (less then 1 day but float)
od("2023-10-01 12:30:45").diff("2023-10-08 12:30:45", "w") // -1 (difference in weeks)
od("2023-10-01 12:30:45").diff("2023-10-05 12:30:45", "w", true) // -0.57... (float weeks)

// .len(scope, unit?, float?) - calculate the length of a scope in a given unit
od("2023-10-01 12:30:45").len("d", "h") // 24 (hours in a day)
od("2023-10-01 12:30:45").len("M", "d") // 30 (days in June)
od("2023-10-01 12:30:45").len("y", "d") // 366 (days in year)
od("2023-10-01 12:30:45").len("m", "h") // 0 (0 hours in a minute, integer)
od("2023-10-01 12:30:45").len("m", "h", true) // 0.01666... (float)
od("2023-10-01 12:30:45").len("w", "d") // 7 (days in a week)
od("2023-10-01 12:30:45").len("w", "h") // 168 (hours in a week)
```

### Compare

```ts
const d1 = od("2023-10-01")
const d2 = od("2023-10-02")

// .lt(target, scope?) - less than
d1.lt(d2) // true
d1.lt("2023-09-01", "M") // false (October is not less than September in months)

// .gt(target, scope?) - greater than
d1.gt(d2) // false
d1.gt("2023-01-01", "y") // false (same year)

// .eq(target, scope?) - equal
od("2023-10-01").eq("2023-10-01 12:00:00") // false (different time)
od("2023-10-01").eq("2023-10-01 12:00:00", "d") // true (same day)
od("2023-10-01").eq("2023-05-25", "y") // true (same year)

// .le(target, scope?) - less than or equal
d1.le(d2) // true
d1.le(d1) // true

// .ge(target, scope?) - greater than or equal
d1.ge(d1) // true
d1.ge("2023-01-01", "y") // true

// .bt(target1, target2, scope?) - between (inclusive start, exclusive end)
od("2023-10-01").bt("2023-09-30", "2023-10-02") // true
od("2023-10-01").bt("2023-10-01", "2023-10-02", "d") // true (inclusive start)
od("2023-10-01").bt("2023-09-30", "2023-10-01", "d") // false (exclusive end)
```

### Output

```ts
const d = od("2023-10-01 12:30:45")

// Property getters
d.s // "2023-10-01 12:30:45" (default format string)
d.iso // "2023-10-01T04:30:45.000Z" (ISO 8601)
d.ts // 1696134645000 (Unix timestamp in ms)
d.dd // Date object (clone of internal Date)
d.year // 2023
d.month // 10 (1-12, not 0-11 like native Date)
d.date // 01
d.day // 0 (0=Sunday, 1=Monday, ..., 6=Saturday)
d.hour // 12
d.minute // 30
d.second // 45
d.ms // 0
d.od // OhDay instance (clone)

// .p(format?) - print as formatted string
d.p() // "2023-10-01 12:30:45" (default)
d.p("YYYY/MM/DD") // "2023/10/01"
d.p("MM-DD-YYYY") // "10-01-2023"
d.p("HH:mm:ss") // "12:30:45"

// .pa(scope?) - print as array
d.pa() // [2023, 10, 01, 12, 30, 45, 0] (full precision)
d.pa("d") // [2023, 10, 01] (up to day)
d.pa("M") // [2023, 10] (up to month)
d.pa("h") // [2023, 10, 01, 12] (up to hour)
d.pa("w") // [2023, 10, 01] (week reuses day precision)

// .po(scope?) - print as object
d.po() // { year: 2023, month: 10, date: 01, hour: 12, minute: 30, second: 45, ms: 0 }
d.po("d") // { year: 2023, month: 10, date: 01 }
d.po("M") // { year: 2023, month: 10 }
d.po("w") // { year: 2023, month: 10, date: 01 } (week reuses day precision)

// .pd(scope?) - print as Date object at precision
d.pd() // Date object of 2023-10-01 12:30:45
d.pd("d") // Date object of 2023-10-01 00:00:00 (start of day)
d.pd("M") // Date object of 2023-10-01 00:00:00 (start of month)
d.pd("w") // Date object of 2023-10-01 00:00:00 (start of day, week reuses day precision)
```

### Flags

The `OhDayFlag` type defines time units or scopes used across API methods:

```ts
"y" // year
"M" // month
"w" // week
"d" // day
"h" // hour
"m" // minute
"s" // second
"ms" // millisecond
```

### Tokens

The `OhDayToken` type defines format tokens for parsing and printing:

```ts
"YYYY" // 4-digit year
"YY" // 2-digit year
"MM" // 2-digit month (01-12)
"M" // 1 or 2-digit month (1-12)
"DD" // 2-digit day of month (01-31)
"D" // 1 or 2-digit day of month (1-31)
"HH" // 2-digit hour (00-23)
"H" // 1 or 2-digit hour (0-23)
"mm" // 2-digit minute (00-59)
"m" // 1 or 2-digit minute (0-59)
"ss" // 2-digit second (00-59)
"s" // 1 or 2-digit second (0-59)
"SSS" // 3-digit millisecond (000-999)
```

## License

ohday is licensed under a [MIT License](./LICENSE).
