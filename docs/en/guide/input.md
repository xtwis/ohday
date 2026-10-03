---
title: Input
order: 3
---

# {{ $frontmatter.title }}

The `od(input, format?)` factory accepts seven input shapes. Pick the one that matches the data you already have; every shape produces an OhDay.

## String

The most common path. Without an explicit format, ohday auto-detects the layout by looking at separators:

```ts
import { od } from "@xtwis/ohday"

od("2023-10-01 12:30:45") // "2023-10-01 12:30:45"
od("2023-10-01") // "2023-10-01 00:00:00"
od("2023-10-01T12:30:45Z") // ISO 8601; the T and Z are accepted as-is
```

Three separators trigger the parser: `-` and `/` for dates, `:` for times, `T` or whitespace between date and time. A `.` inside the time portion is treated as the millisecond separator.

If the input contains only a time, the date portion fills in with today's date:

```ts
od("12:30:45") // today's date + 12:30:45
```

If the input contains only a date, the time portion defaults to 00:00:00.

## Custom Format

Pass a format string as the second argument to control parsing:

```ts
od("01-10-2023", "DD-MM-YYYY") // "2023-10-01 00:00:00"
od("23-10-01 12:30", "YY-MM-DD HH:mm") // "2023-10-01 12:30:00"
```

The format string uses the same token vocabulary as output, see [Concepts](./concepts.md#token). The 2-digit year token `YY` is padded to `20YY`, so `"23"` becomes `2023`.

## Array

Array input is positional: `[year, month, date, hour, minute, second, ms?]`. Missing entries follow the [default rules](#defaults).

```ts
od([2023, 10, 1, 12, 30, 45]) // "2023-10-01 12:30:45"
od([2023, 10, 1]) // "2023-10-01 00:00:00"
od([2023, 10]) // "2023-10-01 00:00:00" (date defaults to 1)
```

## Object

Object input is by field name. Missing fields follow the same defaults.

```ts
od({ year: 2023, month: 10, date: 1, hour: 12, minute: 30, second: 45 })
od({ year: 2023, month: 10 }) // "2023-10-01 00:00:00"
od({ hour: 12 }) // today's date at 12:00:00
```

The accepted keys are `year`, `month`, `date`, `day`, `hour`, `minute`, `second`, `ms`. `day` is the day of week (0 to 6, 0 is Sunday) and adjusts `date` to the corresponding day within the same week.

## Date, Number, OhDay

The other three shapes are direct:

```ts
od(new Date("2023-10-01")) // copies the Date object
od(1696134645000) // Unix timestamp in milliseconds
const d = od("2023-10-01")
od(d) // returns a new OhDay with the same internal Date
```

A `number` is always interpreted as a Unix timestamp in milliseconds. To pass an existing `OhDay`, just hand it over; the constructor reads its internal field and clones.

## Defaults

The fill rules for missing fields:

| Field                            | Default when missing                             |
| -------------------------------- | ------------------------------------------------ |
| `year`                           | current year                                     |
| `month`                          | 1 if `year` is set, else current month           |
| `date`                           | 1 if `year` or `month` is set, else current date |
| `hour`, `minute`, `second`, `ms` | 0                                                |

This is why `{ hour: 12 }` returns today at 12:00:00 (year, month, date all default to current), while `{ year: 2023 }` returns 2023-01-01 00:00:00 (month and date both default to 1).

## Next

- [Change](./change.md) for `c`, `cs`, and `ce`.
