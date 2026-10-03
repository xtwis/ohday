---
title: Comparison
order: 6
---

# {{ $frontmatter.title }}

六个方法覆盖了所有比较. 它们共用同一个内部实现, 区别只在对结果的解释.

## lt / gt / eq / le / ge

五种直接比较, 都返回 boolean:

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

不传 scope 时, 比较按毫秒精度进行. target 接受任何 [OhDayLike](./input.md) 形态: 另一个 OhDay, 字符串, Date, 时间戳, 数组, 对象.

## Scope

传 scope 以更粗的精度比较. 比较前先把两侧对齐到 scope 的起点:

```ts
od("2023-10-01").eq("2023-10-01 12:00:00") // false (时间不同)
od("2023-10-01").eq("2023-10-01 12:00:00", "d") // true (同一天)
od("2023-10-01").eq("2023-05-25", "y") // true (同一年)
od("2023-10-01").lt("2023-09-01", "M") // false (按月算 10 月不小于 9 月)
```

内部实现是 `_cmp(target, scope)`, 返回 `cs(scope).ts - target.cs(scope).ts`. 两侧在 scope 之下的字段先清零, 再比时间戳.

## bt(target1, target2, scope?)

between, 左闭右开:

```ts
od("2023-10-01").bt("2023-09-30", "2023-10-02") // true
od("2023-10-01").bt("2023-10-01", "2023-10-02", "d") // true (起点包含)
od("2023-10-01").bt("2023-09-30", "2023-10-01", "d") // false (终点不包含)
```

`bt` 等价于 `ge(target1, scope) && lt(target2, scope)`. 传 scope 时两个端点先对齐到该 scope.

## 为什么要先对齐

朴素的 `diff` 比较在粗 scope 下会撞上截断问题. 内部的 `_cmp` 通过先对齐避开这个陷阱:

```ts
od("2023-10-01 23:59:59").lt("2023-10-02 00:00:01") // true (毫秒精度)
od("2023-10-01 23:59:59").lt("2023-10-02 00:00:01", "d")
// 对齐后: 2023-10-01 00:00:00 vs 2023-10-02 00:00:00 -> true
```

`diff` 与比较方法共存是有意为之. `diff` 度量时长, 比较方法回答某个精度下的 yes/no.

## 下一步

- [Output](./output.md): `s`, `p`, `pa`, `po`, `pd`.
