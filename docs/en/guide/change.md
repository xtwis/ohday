---
title: Change
order: 4
---

# {{ $frontmatter.title }}

Three methods cover all changes to an OhDay. Each takes a scope flag and an optional value, and returns a new instance.

## c(scope, value)

Sets the field at the given scope to the given value:

```ts
import { od } from "@xtwis/ohday"

od("2023-10-01 12:30:45").c("y", 2025).s // "2025-10-01 12:30:45"
od("2023-10-01 12:30:45").c("M", 2).s // "2023-02-01 12:30:45"
od("2023-10-01 12:30:45").c("d", 32).s // "2023-11-01 12:30:45" (Date advances)
od("2023-10-01 12:30:45").c("h", 0).s // "2023-10-01 00:30:45"
```

The change is positional. `c("d", 32)` asks for day 32 of October; JavaScript's Date arithmetic advances that into November 1.

## Overflow

When changing the year or month leaves the date out of range, ohday falls back to the last valid day of the target month:

```ts
od("2024-02-29").c("y", 2025).s // "2025-02-28 12:00:00"
od("2023-01-31").c("M", 2).s // "2023-02-28 00:00:00"
```

The check is `Date.getDate() !== source.date` after the set call. JavaScript's Date arithmetic already advances the date when the original day does not exist in the new month; ohday then rewinds to the previous day so the result never lands outside the target month.

## cs(scope, value?)

Sets the field at the given scope, then zeros out everything below it. `cs("M")` lands on the first day of the month at 00:00:00:

```ts
od("2023-10-01 12:30:45").cs("y").s // "2023-01-01 00:00:00"
od("2023-10-01 12:30:45").cs("M").s // "2023-10-01 00:00:00"
od("2023-10-01 12:30:45").cs("d").s // "2023-10-01 00:00:00"
```

The optional second argument sets a different value at the scope:

```ts
od("2023-10-01 12:30:45").cs("M", 5).s // "2023-05-01 00:00:00"
od("2023-10-04 12:30:45").cs("w", 5).s // "2023-10-06 00:00:00" (start of Friday)
```

## ce(scope, value?)

The dual of `cs`. Sets the field to its maximum value, then fills everything below with the maximum at that level:

```ts
od("2023-10-01 12:30:45").ce("y").s // "2023-12-31 23:59:59"
od("2023-10-01 12:30:45").ce("M").s // "2023-10-31 23:59:59"
od("2023-10-01 12:30:45").ce("d").s // "2023-10-01 23:59:59"
```

For `M`, the maximum date is `daysOfMonth(year, month)`, which handles leap years for February.

## Week Handling

The `w` flag does not appear in the ordering of `y`, `M`, `d`, `h`, `m`, `s`, `ms`. It is converted into a `d` delta before any of the above methods run:

```ts
od("2023-10-04 12:30:45").c("w", 0).s // "2023-10-01 12:30:45" (Wednesday to Sunday)
od("2023-10-01 12:30:45").c("w", 3).s // "2023-10-04 12:30:45" (Sunday to Wednesday)
od("2023-10-04 12:30:45").cs("w").s // "2023-10-01 00:00:00" (start of week, Sunday)
od("2023-10-01 12:30:45").cs("w", 3).s // "2023-10-04 00:00:00" (start of Wednesday)
od("2023-10-04 12:30:45").ce("w").s // "2023-10-07 23:59:59" (end of week, Saturday)
od("2023-10-04 12:30:45").ce("w", 3).s // "2023-10-04 23:59:59" (end of Wednesday)
```

When the source date is already on the target day, the operation is a no-op for `c` and zeros the time for `cs` and `ce`.

With the [ISO Week plugin](../plugin/iso-week.md) installed, the same calls produce different results. The defaults land on Sunday; ISO weeks start on Monday.

## Next

- [Calculation](./calculate.md) for `add`, `sub`, `diff`, and `len`.
