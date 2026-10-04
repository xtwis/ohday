---
title: Types
order: 0
---

# Types

This page documents the core types of ohday: the flag, token, and input unions, plus the factory and plugin shapes. Each section gives the type signature, then explains what each value means.

## OhDayFlag {#flag}

`OhDayFlag` is the union of time units used as method parameters across the API.

```ts
type OhDayFlag = "y" | "M" | "w" | "d" | "h" | "m" | "s" | "ms"
```

| Flag | Unit               | Note                                  |
| ---- | ------------------ | ------------------------------------- |
| `y`  | year               |                                       |
| `M`  | month              | 1 to 12, not 0 to 11 like native Date |
| `w`  | week (day of week) | 0 is Sunday, 6 is Saturday            |
| `d`  | day                |                                       |
| `h`  | hour               | 0 to 23                               |
| `m`  | minute             |                                       |
| `s`  | second             |                                       |
| `ms` | millisecond        |                                       |

Two flags differ from intuition:

- `M` is month, not minute. Lowercase `m` is minute.
- `w` is the day of week (0 to 6), not a unit of duration. Methods that accept `w` treat it as a delta on `d`.

See [Concepts - Flag](../guide/concepts.md#flag) for usage.

## OhDayToken {#token}

`OhDayToken` is the union of format tokens used in format strings.

```ts
type OhDayToken = "YYYY" | "YY" | "MM" | "M" | "DD" | "D" | "HH" | "H" | "mm" | "m" | "ss" | "s" | "SSS"
```

| Token  | Output              | Example |
| ------ | ------------------- | ------- |
| `YYYY` | 4-digit year        | 2023    |
| `YY`   | 2-digit year        | 23      |
| `MM`   | 2-digit month       | 10      |
| `M`    | 1 or 2-digit month  | 10      |
| `DD`   | 2-digit day         | 01      |
| `D`    | 1 or 2-digit day    | 1       |
| `HH`   | 2-digit hour        | 12      |
| `mm`   | 2-digit minute      | 30      |
| `m`    | 1 or 2-digit minute | 30      |
| `ss`   | 2-digit second      | 45      |
| `s`    | 1 or 2-digit second | 45      |
| `SSS`  | 3-digit millisecond | 678     |

The 2-digit year token `YY` pads to `20YY`. `"23"` becomes `2023`.

See [Concepts - Token](../guide/concepts.md#token) for usage.

## OhDayLike

`OhDayLike` is the union of every shape ohday can parse into a date. Every method that accepts a `target` parameter uses this type.

```ts
type OhDayLike = Date | OhDay | string | number | number[] | {
  year?: number
  month?: number
  date?: number
  day?: number
  hour?: number
  minute?: number
  second?: number
  ms?: number
}
```

Each variant:

- **`Date`**: a JavaScript `Date` object, cloned.
- **`OhDay`**: another `OhDay` instance; its internal `Date` is cloned.
- **`string`**: auto-detected by separator (`-`, `/`, `:`, `T`, whitespace), or parsed with a custom format.
- **`number`**: Unix timestamp in milliseconds.
- **`number[]`**: positional `[year, month, date, hour, minute, second, ms?]`.
- **`object`**: by field name. Missing fields follow the [defaults](../guide/input.md#defaults).

See [Input](../guide/input.md) for the full parsing rules.

## OhDayFactory

`OhDayFactory` is the type of the `od` factory function.

```ts
interface OhDayFactory {
  (input?: OhDayLike, format?: string): OhDay
  use: (plugin: OhDayPlugin) => OhDayFactory
}
```

Two parts:

- The call signature: `od(input?, format?)` returns a new `OhDay`.
- The `use` method installs a plugin. Plugins extend the `OhDay` prototype and may also extend the factory itself.

## OhDayPlugin

`OhDayPlugin` is the function shape a plugin must conform to.

```ts
type OhDayPlugin = ((instance: typeof OhDay, factory: OhDayFactory) => void) & { $i?: boolean }
```

A plugin receives the `OhDay` class and the `od` factory, then mutates the class prototype to add new methods. The `$i` flag marks whether the plugin has been installed, preventing duplicate installation.

See [Concepts - Plugin System](../guide/concepts.md#plugin-system) for details and the [Plugin docs](../plugin/) for built-in examples.
