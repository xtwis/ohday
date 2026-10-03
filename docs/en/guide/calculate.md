---
title: Calculation
order: 5
---

# {{ $frontmatter.title }}

Four methods cover all calculations. `add` and `sub` move a date by a given offset; `diff` measures the gap between two dates; `len` measures the size of a unit.

## add(scope, offset)

Adds the offset to the field at the given scope:

```ts
import { od } from "@xtwis/ohday"

od("2023-10-01 12:30:45").add("d", 5).s // "2023-10-06 12:30:45"
od("2023-10-01 12:30:45").add("M", 4).s // "2024-02-01 12:30:45"
od("2023-10-01 12:30:45").add("y", -1).s // "2022-10-01 12:30:45"
```

The offset may be negative. Internally `add(scope, offset)` is `c(scope, g(scope) + offset)`, so it inherits the [overflow handling](./change.md#overflow) of `c`.

## sub(scope, offset)

Subtracts the offset:

```ts
od("2023-10-01 12:30:45").sub("h", 15).s // "2023-09-30 21:30:45"
od("2023-10-01 12:30:45").sub("M", 3).s // "2023-07-01 12:30:45"
```

Equivalent to `add(scope, -offset)`.

## Week Offsets

Adding or subtracting a week is internally `d += offset * 7`:

```ts
od("2023-10-01 12:30:45").add("w", 1).s // "2023-10-08 12:30:45"
od("2023-10-01 12:30:45").sub("w", 2).s // "2023-09-17 12:30:45"
```

## diff(target, unit?, float?)

Returns the difference between the current date and a target date. Positive when the target is in the past relative to the current date.

```ts
od("2023-09-28 08:00:00").diff("2023-10-01 12:30:45", "d") // -3 (integer days)
od("2023-09-28 08:00:00").diff("2023-10-01 12:30:45", "d", true) // -3.18... (float days)
od("2023-10-01 12:30:45").diff("2023-10-02", "d") // 0 (less than 1 day)
od("2023-10-01 12:30:45").diff("2023-10-01", "d", true) // 0.52... (float)
od("2023-10-01 12:30:45").diff("2023-10-08 12:30:45", "w") // -1 (difference in weeks)
od("2023-10-01 12:30:45").diff("2023-10-05 12:30:45", "w", true) // -0.57... (float weeks)
```

Without `unit`, the result is in milliseconds. The third argument `float` switches between integer (truncated toward zero) and floating-point output.

### Units

| Unit | Behavior                                    |
| ---- | ------------------------------------------- |
| `y`  | complete years, with sign-aware correction  |
| `M`  | complete months, with sign-aware correction |
| `w`  | weeks (truncated)                           |
| `d`  | days (truncated)                            |
| `h`  | hours (truncated)                           |
| `m`  | minutes (truncated)                         |
| `s`  | seconds (truncated)                         |
| `ms` | milliseconds (no truncation)                |

For `w`, `d`, `h`, `m`, `s`, the integer form is `Math.trunc(diffMs / unit)`. For `y` and `M`, ohday applies an extra correction so that adjacent years and months are not counted as full.

### Year and Month Correction

Without correction, plain `diffMs / MS_A_YEAR` rounds in unhelpful ways. ohday detects when the millisecond difference and the year difference disagree and adjusts by one:

```ts
od("2023-12-31").diff("2024-01-01", "y") // 0 (1 day apart, less than 1 full year)
od("2023-12-31").diff("2024-01-01", "y", true) // -0.0027... (float, no correction)
```

The correction only applies to integer output. With `float`, the result is `diffMs / MS_A_YEAR` directly.

## len(scope, unit?, float?)

Returns the length of the field at the given scope, measured in the given unit:

```ts
od("2023-10-01 12:30:45").len("d", "h") // 24 (hours in a day)
od("2023-10-01 12:30:45").len("M", "d") // 31 (October has 31 days)
od("2023-10-01 12:30:45").len("y", "d") // 365 (2023 is not a leap year)
od("2023-10-01 12:30:45").len("w", "d") // 7 (days in a week)
od("2023-10-01 12:30:45").len("w", "h") // 168 (hours in a week)
```

Internally `len(scope, unit)` is `cs(scope).add(scope, 1).diff(cs(scope), unit)`. The third `float` argument controls truncation, same as `diff`.

## Next

- [Comparison](./compare.md) for `eq`, `lt`, `gt`, `le`, `ge`, and `bt`.
