---
title: 输出
order: 7
---

# {{ $frontmatter.title }}

OhDay 通过 getter 与四个输出方法暴露值. 按你的代码期待的形态选最合适的那一个.

## Getter

每个 OhDay 提供 13 个最常用的 getter:

```ts
import { od } from "@xtwis/ohday"

const d = od("2023-10-01 12:30:45.678")

d.s // "2023-10-01 12:30:45" (默认格式)
d.iso // "2023-10-01T04:30:45.678Z" (ISO 8601)
d.ts // 1696159845678 (Unix 时间戳, 毫秒)
d.dd // Date 对象 (内部 Date 的克隆)

d.year // 2023
d.month // 10 (1 到 12, 不是 0 到 11)
d.date // 1
d.day // 0 (0 是周日, 6 是周六)
d.hour // 12
d.minute // 30
d.second // 45
d.ms // 678

d.od // OhDay 实例 (自身的克隆)
```

两个值与原生 Date 对象不一致. `month` 是 1 到 12 (日历习惯), 不是 0 到 11. `day` 是 0 到 6 (0 是周日), 与 `Date.getDay()` 一致.

## p(format?)

按格式串输出字符串. 格式串使用 [Concepts 中的 token 词汇](./concepts.md#token):

```ts
const d = od("2023-10-01 12:30:45")
d.p() // "2023-10-01 12:30:45" (默认)
d.p("YYYY/MM/DD") // "2023/10/01"
d.p("MM-DD-YYYY") // "10-01-2023"
d.p("HH:mm:ss") // "12:30:45"
```

默认格式是 `YYYY-MM-DD HH:mm:ss`. `p` 不传参数时与 `.s` getter 等价.

## pa(scope?)

按给定精度输出数组. 默认 scope 是 `ms` (全精度):

```ts
const d = od("2023-10-01 12:30:45")

d.pa() // [2023, 10, 1, 12, 30, 45, 0]
d.pa("d") // [2023, 10, 1]
d.pa("M") // [2023, 10]
d.pa("h") // [2023, 10, 1, 12]
```

注意 `pa("w")` 与 `pa("d")` 相同. 周这个 scope 复用日的精度, 因为 `w` 表示周几, 不是一个独立的时长单位.

## po(scope?)

按给定精度输出对象:

```ts
d.po() // { year: 2023, month: 10, date: 1, hour: 12, minute: 30, second: 45, ms: 0 }
d.po("d") // { year: 2023, month: 10, date: 1 }
d.po("M") // { year: 2023, month: 10 }
```

精度规则与 `pa` 相同.

## pd(scope?)

按给定精度输出 `Date` 对象. 结果始终对齐到 scope 的 **起点**:

```ts
d.pd() // 2023-10-01 12:30:45 对应的 Date (全精度)
d.pd("d") // 2023-10-01 00:00:00 对应的 Date (当日起点)
d.pd("M") // 2023-10-01 00:00:00 对应的 Date (当月起点)
d.pd("y") // 2023-01-01 00:00:00 对应的 Date (当年起点)
```

这是唯一一个 **不是截断而是对齐** 的方法. `pd("d")` 返回当日 0 点, 不是当日正午. 如果你需要截断, 先 `cs(scope)` 再 `pd()`.

## 内部 Getter: g

`g(scope?)` 是命名 getter 的一般形式. 不传参数时返回时间戳 (与 `ts` 相同). 传 scope 时返回该 scope 的值, 其中 `w` 返回周几:

```ts
d.g() // 1696159845000 (时间戳, 毫秒)
d.g("y") // 2023
d.g("M") // 10
d.g("w") // 0 (周几, 0 是周日)
```

大多数代码优先使用命名 getter 以保证可读性; `g` 是给插件作者与泛型代码用的.

## 下一步

- [Concepts](./concepts.md): flag/token/scope/unit 的心智模型.
- 通过侧边栏浏览指南的其余部分.
