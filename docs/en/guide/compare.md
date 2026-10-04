---
title: Comparison
order: 6
---

# {{ $frontmatter.title }}

Six methods cover all comparisons. They share a single internal comparator and only differ in how the result is interpreted.

## lt / gt / eq / le / ge

Five direct comparisons, all returning a boolean:

```ts
import { od } from "@xtwis/ohday"

const d1 = od("2023-10-01")
const d2 = od("2023-10-02")

d1.lt(d2) // true
d1.gt(d2) // false
d1.eq(d2) // false
d1.le(d2) // true
d1.ge(d2) // false
```

Without a scope argument, comparison runs at millisecond precision. The target accepts any [OhDayLike](./input.md) shape: another OhDay, a string, a Date, a timestamp, an array, or an object.

## Scope

Pass a scope to compare at coarser precision. Both sides are aligned to the start of the scope before comparison:

```ts
od("2023-10-01").eq("2023-10-01 12:00:00") // false (different time)
od("2023-10-01").eq("2023-10-01 12:00:00", "d") // true (same day)
od("2023-10-01").eq("2023-05-25", "y") // true (same year)
od("2023-10-01").lt("2023-09-01", "M") // false (October is not before September in months)
```

The internal implementation is `_cmp(target, scope)`, which returns `cs(scope).ts - target.cs(scope).ts`. Both sides are zeroed below the scope, then the timestamps are compared.

## bt(target1, target2, scope?)

`between`: checks whether the date lies between `target1` and `target2`, with inclusive start and exclusive end:

```ts
od("2023-10-01").bt("2023-09-30", "2023-10-02") // true
od("2023-10-01").bt("2023-10-01", "2023-10-02", "d") // true (inclusive start)
od("2023-10-01").bt("2023-09-30", "2023-10-01", "d") // false (exclusive end)
```

`bt` is implemented as `ge(target1, scope) && lt(target2, scope)`. With a scope, both endpoints are aligned to that scope before the test.

## Why Align First

A naive `diff` comparison runs into truncation issues at coarse scopes. The internal `_cmp` avoids the trap by aligning both sides first:

```ts
od("2023-10-01 23:59:59").lt("2023-10-02 00:00:01") // true (millisecond precision)
od("2023-10-01 23:59:59").lt("2023-10-02 00:00:01", "d")
// aligned: 2023-10-01 00:00:00 vs 2023-10-02 00:00:00 -> true
```

Both `diff` and the comparison methods exist because the difference is intentional. `diff` measures duration; comparison answers a yes/no question at a chosen precision.

## Next

- [Output](./output.md) for `s`, `p`, `pa`, `po`, and `pd`.
