---
title: ISO Week Plugin
order: 2
---

# {{ $frontmatter.title }}

The `isoWeek` plugin switches ohday from the default week numbering (0 = Sunday, ..., 6 = Saturday) to ISO 8601 (1 = Monday, ..., 7 = Sunday). It also rewires the internal `c("w", ...)`, `cs("w")`, and `ce("w")` paths so week boundaries align to Monday by default.

## Install

```ts
import { od } from "@xtwis/ohday"
import { isoWeek } from "@xtwis/ohday/plugin"

od.use(isoWeek) // ISO weeks are enabled by default
```

Once installed, every new OhDay reads week numbers under ISO rules until a per-instance override is set.

## Day Getter

Under ISO weeks, `day` returns 1 to 7 instead of 0 to 6:

```ts
od("2023-10-04").day // 3 (Wednesday, same as before)
od("2023-10-01").day // 7 (Sunday, was 0)
```

The remap only touches Sunday. Monday through Saturday keep their original numbers.

## Default vs ISO Week

The same calls produce different results depending on whether ISO weeks are in effect. The source date is 2023-10-04 (Wednesday):

| Expression   | Default (Sun = 0)                | With `isoWeek` (Mon = 1)              |
| ------------ | -------------------------------- | ------------------------------------- |
| `.day`       | 3                                | 3                                     |
| `.c("w", 0)` | "2023-10-01 12:30:45" (Sunday)   | "2023-10-01 12:30:45" (Sunday, day 7) |
| `.cs("w")`   | "2023-10-01 00:00:00" (Sunday)   | "2023-10-02 00:00:00" (Monday)        |
| `.ce("w")`   | "2023-10-07 23:59:59" (Saturday) | "2023-10-08 23:59:59" (Sunday)        |

With ISO weeks, `cs("w")` lands on Monday and `ce("w")` ends on Sunday, matching the ISO calendar week.

## Global Switch

`od.isoWeek(flag?)` reads or sets the global default. Passing `undefined` or no argument enables it; passing a boolean sets it explicitly.

```ts
od.isoWeek() // true (enabled by default after install)
od.isoWeek(false) // disable
od.isoWeek() // false
od.isoWeek() // re-enable (no argument is the same as passing true)
od.iw() // short alias of od.isoWeek()
```

The global switch applies to instances that do not have a per-instance override.

## Instance Switch

Override the global on a single chain:

```ts
const a = od("2023-10-01").isoWeek() // explicit true
const b = od("2023-10-01").normalWeek() // explicit false
const c = od("2023-10-01").iw() // short alias of isoWeek()
const d = od("2023-10-01").nw() // short alias of normalWeek()

a.day // 7
b.day // 0
```

`isoWeek(flag?)` and `normalWeek()` both return a new instance. The original is unchanged.

## Sticky Propagation

The per-instance flag is sticky through `c`, `cs`, `ce`, and clone:

```ts
const a = od("2023-10-01").normalWeek() // $iw = false
const b = a.add("d", 7) // next Sunday, sticky false
b.day // 0 (Sunday is 0 here, since $iw overrides the global)

const c = od("2023-10-01").isoWeek() // $iw = true
const d = c.add("d", 7)
d.day // 7
```

This matters when you derive children from a base instance. The week behavior set on the base carries down the chain until you call `normalWeek()` or `isoWeek()` again.

## Next

- [Fullname Plugin](./fullname.md) for long-name method aliases.
- [API Reference](../reference/api.md) for the complete public surface.
