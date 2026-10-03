---
title: Fullname 插件
order: 1
---

# {{ $frontmatter.title }}

`fullname` 插件为 `OhDay` 的每个短方法补一份长名别名. 它面向偏好可读性而非简洁度的代码库. 短方法继续工作, 每个新别名与原方法行为一致.

## 安装

```ts
import { od } from "@xtwis/ohday"
import { fullname } from "@xtwis/ohday/plugin"

od.use(fullname)

const d = od("2023-10-01 12:30:45")
d.set("y", 2025).startOf("M").getString()
```

`fullname` 在工厂上只安装一次. 之后创建的每个 OhDay 实例都能看到这些新方法.

## 别名表

### Information (getter 别名)

| 别名                           | 替代      |
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

| 别名                                                          | 替代          |
| ------------------------------------------------------------- | ------------- |
| `format(fmt?)`, `print(fmt?)`, `toString(fmt?)`               | `.p(fmt?)`    |
| `printArray(scope?)`, `toArray(scope?)`                       | `.pa(scope?)` |
| `printObject(scope?)`, `toObject(scope?)`                     | `.po(scope?)` |
| `printDate(scope?)`, `toDate(scope?)`, `toDateObject(scope?)` | `.pd(scope?)` |

### Manipulation

| 别名                                                     | 替代                  |
| -------------------------------------------------------- | --------------------- |
| `set(scope, value)`, `change(scope, value)`              | `.c(scope, value)`    |
| `startOf(scope, value?)`, `changeToStart(scope, value?)` | `.cs(scope, value?)`  |
| `endOf(scope, value?)`, `changeToEnd(scope, value?)`     | `.ce(scope, value?)`  |
| `get(scope?)`                                            | `.g(scope?)`          |
| `subtract(scope, offset)`                                | `.sub(scope, offset)` |
| `lengthOf(scope, unit?)`, `getLength(scope, unit?)`      | `.len(scope, unit?)`  |

### Comparison

| 别名                                                                | 替代                  |
| ------------------------------------------------------------------- | --------------------- |
| `isSame(target, scope?)`, `isEqual(target, scope?)`                 | `.eq(target, scope?)` |
| `isBefore(target, scope?)`, `isLessThan(target, scope?)`            | `.lt(target, scope?)` |
| `isAfter(target, scope?)`, `isGreaterThan(target, scope?)`          | `.gt(target, scope?)` |
| `isSameOrBefore(...)`, `isBeforeOrSame(...)`, `isLessOrEqual(...)`  | `.le(target, scope?)` |
| `isSameOrAfter(...)`, `isAfterOrSame(...)`, `isGreaterOrEqual(...)` | `.ge(target, scope?)` |
| `isBetween(t1, t2, scope?)`                                         | `.bt(t1, t2, scope?)` |

## 示例

```ts
import { od } from "@xtwis/ohday"
import { fullname } from "@xtwis/ohday/plugin"

od.use(fullname)

const d = od("2023-10-01 12:30:45")

d.set("y", 2025).startOf("M").getString() // "2025-10-01 00:00:00"
d.isBefore("2024-01-01", "y") // true
d.format("YYYY/MM/DD") // "2023/10/01"
```

原短方法继续工作. 看重可读性时装 `fullname`, 看重链式紧凑度时跳过.

## 下一步

- [ISO Week 插件](./iso-week.md): ISO 8601 周编号.
