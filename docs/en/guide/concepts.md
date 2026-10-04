---
title: Concepts
order: 2
---

# {{ $frontmatter.title }}

Before diving into individual methods, this page sketches ohday's overall design. The library is small; the rest of the guide just enumerates what each piece does.

## Design Philosophy

Three commitments shape every API decision:

- **Immutable chain.** Every method returns a new OhDay, so chains can be safely forked.
- **Short and unified naming.** Method names are as short as possible while staying readable. Parameter names are consistent across the API.
- **Zero dependencies.** Nothing to vendor at runtime.

These three together produce a library that is small enough to vendor inline, fast enough to call in tight loops, and predictable enough to reason about without reading the source.

## Basic Model

ohday operates on a thin object model: an `OhDay` instance wraps a `Date`, and every method either reads the wrapped `Date`, transforms it into a new one, or compares it against a target. A handful of small concepts carry the rest.

### Flag

`OhDayFlag` is the union of time units that appear as method parameters across the API: `.c("M", 2)`, `.add("d", 10)`, `.lt(target, "y")`.

Flag is used in every method that asks "which time unit?". Two flags differ from intuition: `M` is month, not minute (lowercase `m` is minute); `w` is day of week (0 to 6), not a unit of duration.

See the [API Reference](./reference/types.md#flag) for the full list.

### Token

`OhDayToken` is the union of format tokens that appear in format strings.

Token drives both directions of the formatter at the same time: `p(fmt)` produces output, `od(str, fmt)` parses input. Both directions share the same vocabulary, so what you print you can read back.

See the [API Reference](./reference/types.md#token) for the full list.

### Scope and Unit

Two terms that sound similar but mean different things:

- **Scope** is the time dimension an operation acts on. It is the first parameter of `c`, `cs`, `ce`, `add`, `sub`, `len`, and the optional second parameter of comparison methods. `c("M", 2)` operates on the month scope.
- **Unit** is the measurement unit of the result. It is the optional second parameter of `diff` and `len`. `diff(target, "d")` returns the difference in days.

Both parameters accept the same `OhDayFlag` values; the difference is purely semantic.

### OhDayLike

Most methods that take a `target` (`diff` and every comparison method) accept any `OhDayLike`. This is a single union that covers every way to express a date: a `Date` object, another `OhDay` instance (cloned), a string (auto-detected or parsed with a custom format), a number (Unix timestamp in ms), a number array `[year, month, date, hour, minute, second, ms?]`, or an object `{ year, month, date, day, hour, minute, second, ms }`. The same defaults that apply when constructing an OhDay apply here too.

See [Input](./input.md) for the full parsing rules.

## Core Operations

Five categories cover everything the API does:

| Category    | Methods                                                                | Guide                         |
| ----------- | ---------------------------------------------------------------------- | ----------------------------- |
| Input       | `od(input, format?)`                                                   | [Input](./input.md)           |
| Change      | `c`, `cs`, `ce`                                                        | [Change](./change.md)         |
| Calculation | `add`, `sub`, `diff`, `len`                                            | [Calculation](./calculate.md) |
| Comparison  | `lt`, `gt`, `eq`, `le`, `ge`, `bt`                                     | [Comparison](./compare.md)    |
| Output      | `s`, `iso`, `ts`, `dd`, `g`, `p`, `pa`, `po`, `pd`, plus named getters | [Output](./output.md)         |

Pick the category that matches the operation you have in mind. Most chains move through two or three of them.

## Plugin System

A plugin is a function that receives the OhDay class and the od factory, then mutates the class prototype to add new methods. The factory exposes a `use` method that runs the plugin once and guards against duplicate installation:

```ts
import type { OhDay, OhDayFactory, OhDayPlugin } from "@xtwis/ohday"

const myPlugin: OhDayPlugin = (instance: typeof OhDay, factory: OhDayFactory) => {
  instance.prototype.tomorrow = function () {
    return this.add("d", 1)
  }
}

od.use(myPlugin)

const t = od("2023-10-01").tomorrow()
console.log(t.s) // "2023-10-02 00:00:00"
```

To make the new method visible to TypeScript, the plugin file augments the module:

```ts
declare module "@xtwis/ohday" {
  interface OhDay {
    tomorrow: () => OhDay
  }
}
```

See the [Fullname Plugin](../plugin/fullname.md) and [ISO Week Plugin](../plugin/iso-week.md) for complete examples.

## Next

- Browse the rest of the guide from the sidebar.
