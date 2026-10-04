---
title: ISO Week 插件
order: 2
---

# {{ $frontmatter.title }}

`isoWeek` 插件把 ohday 的周编号从默认 (0 = 周日, ..., 6 = 周六) 切换到 ISO 8601 (1 = 周一, ..., 7 = 周日). 它还改写内部的 `c("w", ...)`, `cs("w")`, `ce("w")` 路径, 让周边界默认对齐到周一.

## 安装

```ts
import { od } from "@xtwis/ohday"
import { isoWeek } from "@xtwis/ohday/plugin"

od.use(isoWeek) // ISO 周默认开启
```

安装后, 每个新建 OhDay 都按 ISO 规则读取周编号, 除非用实例级开关覆盖.

## Day Getter

在 ISO 周模式下, `day` 返回 1 到 7 而不是 0 到 6:

```ts
od("2023-10-04").day // 3 (周三, 与默认相同)
od("2023-10-01").day // 7 (周日, 原来是 0)
```

重映射只动周日. 周一到周六保持原数字.

## 默认与 ISO 周的对比

同样的调用在两种模式下结果不同. 源日期 2023-10-04 (周三):

| 表达式       | 默认 (周日=0)                | 装上 `isoWeek` (周一=1)             |
| ------------ | ---------------------------- | ----------------------------------- |
| `.day`       | 3                            | 3                                   |
| `.c("w", 0)` | "2023-10-01 12:30:45" (周日) | "2023-10-01 12:30:45" (周日, day=7) |
| `.cs("w")`   | "2023-10-01 00:00:00" (周日) | "2023-10-02 00:00:00" (周一)        |
| `.ce("w")`   | "2023-10-07 23:59:59" (周六) | "2023-10-08 23:59:59" (周日)        |

装上 ISO 周后, `cs("w")` 落在周一, `ce("w")` 结束于周日, 与 ISO 历周对齐.

## 全局开关

`od.isoWeek(flag?)` 读取或设置全局默认. 不传或传 `undefined` 表示开启; 传 boolean 表示显式设置.

```ts
od.isoWeek() // true (安装后默认开启)
od.isoWeek(false) // 关闭
od.isoWeek() // false
od.isoWeek() // 重新开启 (不传等同于传 true)
od.iw() // od.isoWeek 的短别名
```

全局开关作用于没有实例级覆盖的实例.

## 实例开关

在单条链上覆盖全局:

```ts
const a = od("2023-10-01").isoWeek() // 显式 true
const b = od("2023-10-01").normalWeek() // 显式 false
const c = od("2023-10-01").iw() // isoWeek 的短别名
const d = od("2023-10-01").nw() // normalWeek 的短别名

a.day // 7
b.day // 0
```

`isoWeek(flag?)` 与 `normalWeek()` 都返回新实例. 原实例不变.

## Sticky 传播

实例级标志沿 `c`, `cs`, `ce` 以及克隆 sticky 传递:

```ts
const a = od("2023-10-01").normalWeek() // $iw = false
const b = a.add("d", 7) // 下一个周日, sticky false
b.day // 0 (周日这里是 0, 因为 $iw 覆盖了全局)

const c = od("2023-10-01").isoWeek() // $iw = true
const d = c.add("d", 7)
d.day // 7
```

从基础实例派生子链时这一点很关键. 在基础实例上设置的周行为会沿链下传, 直到再次调用 `normalWeek()` 或 `isoWeek()`.

## 下一步

- [Fullname 插件](./fullname.md): 长名方法别名.
- [API 参考](../reference/ohday.md): 完整的公开面.
