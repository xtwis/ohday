---
title: OhDay Class
order: 1
---

# OhDay Class

The `OhDay` class wraps a `Date` and provides the entire API surface. This page lists every public member: the constructor, the getters, the methods, and the `od` factory.

## Constructor

```ts
type OhDayConstructor = new (input?: OhDayLike, format?: string) => OhDay
```

Creates a new `OhDay` instance.

| Parameter | Type         | Description                                                                     |
| --------- | ------------ | ------------------------------------------------------------------------------- |
| `input`   | `OhDayLike?` | Date to parse. See [OhDayLike](./types.md#ohdaylike). Defaults to `new Date()`. |
| `format`  | `string?`    | Custom format string. Only used when `input` is a string.                       |

The parsed `Date` is stored internally and accessed through the getters and methods below. Reaching for the internal field directly is not part of the public API.

## Getters

| Getter   | Type     | Description                          |
| -------- | -------- | ------------------------------------ |
| `s`      | `string` | Default format `YYYY-MM-DD HH:mm:ss` |
| `iso`    | `string` | ISO 8601 format                      |
| `ts`     | `number` | Unix timestamp in milliseconds       |
| `dd`     | `Date`   | Clone of the internal `Date`         |
| `year`   | `number` | Year (e.g. `2023`)                   |
| `month`  | `number` | Month, 1 to 12                       |
| `date`   | `number` | Day of month, 1 to 31                |
| `day`    | `number` | Day of week, 0 (Sun) to 6 (Sat)      |
| `hour`   | `number` | Hour, 0 to 23                        |
| `minute` | `number` | Minute, 0 to 59                      |
| `second` | `number` | Second, 0 to 59                      |
| `ms`     | `number` | Millisecond, 0 to 999                |
| `od`     | `OhDay`  | Clone of self                        |

### g(scope?)

`get`, returns the value at the given scope. Without an argument, returns the timestamp (same as `ts`).

```ts
function g(scope?: OhDayFlag): number
```

`w` returns the day of week; the other scopes return the matching unit.

See [Output](../guide/output.md) for the named getters and [Concepts](../guide/concepts.md#scope-and-unit) for scope semantics.

## Manipulation

### c(scope, value)

`change`: sets the field at the given scope to the given value.

```ts
function c(scope: OhDayFlag, value: number): OhDay
```

When the change leaves the date out of range, ohday rewinds to the last valid day of the target month. See [Change](../guide/change.md).

### cs(scope, value?)

`change to start`: sets the field at the given scope, then zeros everything below it.

```ts
function cs(scope: OhDayFlag, value?: number): OhDay
```

### ce(scope, value?)

`change to end`: sets the field to its maximum value, then fills everything below with the maximum at that level.

```ts
function ce(scope: OhDayFlag, value?: number): OhDay
```

## Calculation

### add(scope, offset)

Adds the offset to the field at the given scope.

```ts
function add(scope: OhDayFlag, offset: number): OhDay
```

Inherits the overflow handling of `c`. Equivalent to `c(scope, g(scope) + offset)`.

### sub(scope, offset)

Subtracts the offset from the field at the given scope.

```ts
function sub(scope: OhDayFlag, offset: number): OhDay
```

Equivalent to `add(scope, -offset)`.

### diff(target, unit?, float?)

Returns the difference between the current date and `target`. Without `unit`, the result is in milliseconds.

```ts
function diff(target: OhDayLike, unit?: OhDayFlag, float?: boolean): number
```

`float` switches between integer (`Math.trunc`) and floating-point output. `y` and `M` apply a sign-aware correction; other units do not. See [Calculation](../guide/calculate.md).

### len(scope, unit?, float?)

Returns the length of the field at the given scope, measured in the given unit.

```ts
function len(scope: OhDayFlag, unit?: OhDayFlag, float?: boolean): number
```

Internally `cs(scope).add(scope, 1).diff(cs(scope), unit)`.

## Comparison

Five direct comparisons plus a range check, all returning a boolean.

With a `scope`, both sides are aligned to the start of that scope before the comparison.

### lt(target, scope?)

`lt`: less than the target at the given scope.

```ts
function lt(target: OhDayLike, scope?: OhDayFlag): boolean
```

### gt(target, scope?)

`gt`: greater than the target at the given scope.

```ts
function gt(target: OhDayLike, scope?: OhDayFlag): boolean
```

### eq(target, scope?)

`eq`: equal to the target at the given scope.

```ts
function eq(target: OhDayLike, scope?: OhDayFlag): boolean
```

### le(target, scope?)

`le`: less than or equal to the target at the given scope.

```ts
function le(target: OhDayLike, scope?: OhDayFlag): boolean
```

### ge(target, scope?)

`ge`: greater than or equal to the target at the given scope.

```ts
function ge(target: OhDayLike, scope?: OhDayFlag): boolean
```

### bt(target1, target2, scope?)

`between`: lies between `target1` and `target2`, inclusive start and exclusive end.

```ts
function bt(target1: OhDayLike, target2: OhDayLike, scope?: OhDayFlag): boolean
```

Implemented as `ge(target1, scope) && lt(target2, scope)`. See [Comparison](../guide/compare.md).

## Output

### p(format?)

`print`: prints as a formatted string using the given format.

```ts
function p(format?: string): string
```

Defaults to `YYYY-MM-DD HH:mm:ss`. Same as the `.s` getter when called with no argument. See [Output](../guide/output.md).

### pa(scope?)

`print as array`: prints as a `number[]` at the given precision.

```ts
function pa(scope?: OhDayFlag): number[]
```

`pa("w")` is the same as `pa("d")`.

### po(scope?)

`print as object`: prints as a `Record<string, number>` at the given precision.

```ts
function po(scope?: OhDayFlag): Record<string, number>
```

### pd(scope?)

`print as date`: prints as a `Date` object at the given precision, aligned to the **start** of the scope.

```ts
function pd(scope?: OhDayFlag): Date
```

This is alignment, not truncation. For truncation, call `cs(scope)` first.

## Factory

The `od` factory creates `OhDay` instances and installs plugins.

### od(input?, format?)

Creates a new `OhDay` instance.

```ts
function od(input?: OhDayLike, format?: string): OhDay
```

Equivalent to `new OhDay(input, format)`. See [Input](../guide/input.md) for the parsing rules.

### od.use(plugin)

Installs a plugin.

```ts
function use(plugin: OhDayPlugin): OhDayFactory
```

The plugin receives the `OhDay` class and the `od` factory, then mutates the class prototype to add new methods. Plugins are installed once; the `$i` flag on the plugin function guards against duplicates.

See [Concepts - Plugin System](../guide/concepts.md#plugin-system) and the [Plugin docs](../plugin/) for built-in examples.
