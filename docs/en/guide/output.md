---
title: Output
order: 7
---

# {{ $frontmatter.title }}

An OhDay exposes its value through getters and four output methods. Pick the one that produces the shape your code expects.

## Getters

Each OhDay has 13 getters for the most common values:

```ts
import { od } from "@xtwis/ohday"

const d = od("2023-10-01 12:30:45.678")

d.s // "2023-10-01 12:30:45" (default format)
d.iso // "2023-10-01T04:30:45.678Z" (ISO 8601)
d.ts // 1696159845678 (Unix timestamp in ms)
d.dd // Date object (clone of internal Date)

d.year // 2023
d.month // 10 (1 to 12, not 0 to 11)
d.date // 1
d.day // 0 (0 is Sunday, 6 is Saturday)
d.hour // 12
d.minute // 30
d.second // 45
d.ms // 678

d.od // OhDay instance (clone of self)
```

Two values diverge from the native Date object. `month` is 1 to 12 (the calendar convention), not 0 to 11. `day` is 0 to 6 (0 is Sunday), matching `Date.getDay()`.

## p(format?)

Print as a formatted string. The format string uses the [token vocabulary from concepts](./concepts.md#token):

```ts
const d = od("2023-10-01 12:30:45")
d.p() // "2023-10-01 12:30:45" (default)
d.p("YYYY/MM/DD") // "2023/10/01"
d.p("MM-DD-YYYY") // "10-01-2023"
d.p("HH:mm:ss") // "12:30:45"
```

The default format is `YYYY-MM-DD HH:mm:ss`. `p` is the same as the `.s` getter when called with no argument.

## pa(scope?)

Print as an array at the given precision. The default scope is `ms` (full precision):

```ts
const d = od("2023-10-01 12:30:45")

d.pa() // [2023, 10, 1, 12, 30, 45, 0]
d.pa("d") // [2023, 10, 1]
d.pa("M") // [2023, 10]
d.pa("h") // [2023, 10, 1, 12]
```

Note that `pa("w")` is the same as `pa("d")`. The week scope reuses day precision because `w` is the day of week, not a separate unit of duration.

## po(scope?)

Print as an object at the given precision:

```ts
d.po() // { year: 2023, month: 10, date: 1, hour: 12, minute: 30, second: 45, ms: 0 }
d.po("d") // { year: 2023, month: 10, date: 1 }
d.po("M") // { year: 2023, month: 10 }
```

Same precision rules as `pa`.

## pd(scope?)

Print as a `Date` object at the given precision. The result is always aligned to the **start** of the scope:

```ts
d.pd() // Date object for 2023-10-01 12:30:45 (full precision)
d.pd("d") // Date object for 2023-10-01 00:00:00 (start of day)
d.pd("M") // Date object for 2023-10-01 00:00:00 (start of month)
d.pd("y") // Date object for 2023-01-01 00:00:00 (start of year)
```

This is the one method that is **not** truncation; it is alignment. `pd("d")` gives the start of the day, not the day at noon. If you need truncation, call `cs(scope)` first then `pd()`.

## Internal Getter: g

`g(scope?)` is the general form of the named getters. Without an argument, it returns the timestamp (same as `ts`). With a scope, it returns the value at that scope, where `w` returns the day of week:

```ts
d.g() // 1696159845000 (timestamp in ms)
d.g("y") // 2023
d.g("M") // 10
d.g("w") // 0 (day of week, 0 is Sunday)
```

Most code should prefer the named getters for readability; `g` exists for plugin authors and generic code.

## Next

- [Concepts](./concepts.md) for the flag/token/scope/unit mental model.
- Browse the rest of the guide from the sidebar.
