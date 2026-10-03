---
title: Fullname Plugin
order: 1
---

# {{ $frontmatter.title }}

The `fullname` plugin adds a long-name alias for every short method on `OhDay`. It exists for codebases that prefer readability over brevity. Every short method still works, and every new alias behaves the same as its target.

## Install

```ts
import { od } from "@xtwis/ohday"
import { fullname } from "@xtwis/ohday/plugin"

od.use(fullname)

const d = od("2023-10-01 12:30:45")
d.set("y", 2025).startOf("M").getString()
```

`fullname` is installed once on the factory. Every OhDay instance created afterward sees the new methods.

## Alias Map

### Information (getter aliases)

| Alias                          | Replaces  |
| ------------------------------ | --------- |
| `getString()`                  | `.s`      |
| `getISOString()`               | `.iso`    |
| `getTime()`, `getTimeStamp()`  | `.ts`     |
| `getDateObject()`              | `.dd`     |
| `getYear()`                    | `.year`   |
| `getMonth()`                   | `.month`  |
| `getDate()`                    | `.date`   |
| `getHour()`                    | `.hour`   |
| `getMinute()`                  | `.minute` |
| `getSecond()`                  | `.second` |
| `getMS()`, `getMilliseconds()` | `.ms`     |
| `clone()`                      | `.od`     |

### Output

| Alias                                                         | Replaces      |
| ------------------------------------------------------------- | ------------- |
| `format(fmt?)`, `print(fmt?)`, `toString(fmt?)`               | `.p(fmt?)`    |
| `printArray(scope?)`, `toArray(scope?)`                       | `.pa(scope?)` |
| `printObject(scope?)`, `toObject(scope?)`                     | `.po(scope?)` |
| `printDate(scope?)`, `toDate(scope?)`, `toDateObject(scope?)` | `.pd(scope?)` |

### Manipulation

| Alias                                                    | Replaces              |
| -------------------------------------------------------- | --------------------- |
| `set(scope, value)`, `change(scope, value)`              | `.c(scope, value)`    |
| `startOf(scope, value?)`, `changeToStart(scope, value?)` | `.cs(scope, value?)`  |
| `endOf(scope, value?)`, `changeToEnd(scope, value?)`     | `.ce(scope, value?)`  |
| `get(scope?)`                                            | `.g(scope?)`          |
| `subtract(scope, offset)`                                | `.sub(scope, offset)` |
| `lengthOf(scope, unit?)`, `getLength(scope, unit?)`      | `.len(scope, unit?)`  |

### Comparison

| Alias                                                               | Replaces              |
| ------------------------------------------------------------------- | --------------------- |
| `isSame(target, scope?)`, `isEqual(target, scope?)`                 | `.eq(target, scope?)` |
| `isBefore(target, scope?)`, `isLessThan(target, scope?)`            | `.lt(target, scope?)` |
| `isAfter(target, scope?)`, `isGreaterThan(target, scope?)`          | `.gt(target, scope?)` |
| `isSameOrBefore(...)`, `isBeforeOrSame(...)`, `isLessOrEqual(...)`  | `.le(target, scope?)` |
| `isSameOrAfter(...)`, `isAfterOrSame(...)`, `isGreaterOrEqual(...)` | `.ge(target, scope?)` |
| `isBetween(t1, t2, scope?)`                                         | `.bt(t1, t2, scope?)` |

## Example

```ts
import { od } from "@xtwis/ohday"
import { fullname } from "@xtwis/ohday/plugin"

od.use(fullname)

const d = od("2023-10-01 12:30:45")

d.set("y", 2025).startOf("M").getString() // "2025-10-01 00:00:00"
d.isBefore("2024-01-01", "y") // true
d.format("YYYY/MM/DD") // "2023/10/01"
```

The original short methods keep working. Use `fullname` when readability matters, or skip it when the inline chain matters.

## Next

- [ISO Week Plugin](./iso-week.md) for ISO 8601 week numbering.
