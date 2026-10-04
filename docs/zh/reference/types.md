---
title: 类型
order: 0
---

# 类型

本页记录 ohday 的核心类型: flag, token, input 联合, 以及工厂与插件的形态. 每节给出类型签名, 再说明每个值的含义.

## OhDayFlag {#flag}

`OhDayFlag` 是 API 中作为方法参数使用的时间单位的联合.

```ts
type OhDayFlag = "y" | "M" | "w" | "d" | "h" | "m" | "s" | "ms"
```

| Flag | 单位      | 说明                              |
| ---- | --------- | --------------------------------- |
| `y`  | 年        |                                   |
| `M`  | 月        | 1 到 12, 不是原生 Date 的 0 到 11 |
| `w`  | 周 (周几) | 0 是周日, 6 是周六                |
| `d`  | 日        |                                   |
| `h`  | 时        | 0 到 23                           |
| `m`  | 分        |                                   |
| `s`  | 秒        |                                   |
| `ms` | 毫秒      |                                   |

有两个 Flag 跟直觉不同:

- `M` 是月, 不是分. 小写 `m` 才是分.
- `w` 是周几 (0 到 6), 不是周这个时长单位. 接受 `w` 的方法把它当成对 `d` 的偏移.

用法见 [核心概念 - Flag](../guide/concepts.md#flag).

## OhDayToken {#token}

`OhDayToken` 是格式串中使用的格式 token 联合.

```ts
type OhDayToken = "YYYY" | "YY" | "MM" | "M" | "DD" | "D" | "HH" | "H" | "mm" | "m" | "ss" | "s" | "SSS"
```

| Token  | 输出     | 示例 |
| ------ | -------- | ---- |
| `YYYY` | 4 位年   | 2023 |
| `YY`   | 2 位年   | 23   |
| `MM`   | 2 位月   | 10   |
| `M`    | 1-2 位月 | 10   |
| `DD`   | 2 位日   | 01   |
| `D`    | 1-2 位日 | 1    |
| `HH`   | 2 位时   | 12   |
| `mm`   | 2 位分   | 30   |
| `m`    | 1-2 位分 | 30   |
| `ss`   | 2 位秒   | 45   |
| `s`    | 1-2 位秒 | 45   |
| `SSS`  | 3 位毫秒 | 678  |

2 位年 token `YY` 会补齐到 `20YY`. `"23"` 变成 `2023`.

用法见 [核心概念 - Token](../guide/concepts.md#token).

## OhDayLike

`OhDayLike` 是 ohday 能解析为日期的所有输入形态的联合. 所有接受 `target` 参数的方法都使用这个类型.

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

每种形态:

- **`Date`**: JavaScript 的 `Date` 对象, 会被克隆.
- **`OhDay`**: 另一个 `OhDay` 实例, 克隆其内部 `Date`.
- **`string`**: 按分隔符自动识别 (`-`, `/`, `:`, `T`, 空白), 或用自定义格式解析.
- **`number`**: Unix 时间戳, 单位毫秒.
- **`number[]`**: 按位置 `[year, month, date, hour, minute, second, ms?]`.
- **`object`**: 按字段名. 缺字段遵循 [默认规则](../guide/input.md#默认规则).

完整解析规则见 [输入](../guide/input.md).

## OhDayFactory

`OhDayFactory` 是 `od` 工厂函数的类型.

```ts
interface OhDayFactory {
  (input?: OhDayLike, format?: string): OhDay
  use: (plugin: OhDayPlugin) => OhDayFactory
}
```

两部分:

- 调用签名: `od(input?, format?)` 返回新 `OhDay`.
- `use` 方法安装插件. 插件扩展 `OhDay` 原型, 也可以扩展工厂本身.

## OhDayPlugin

`OhDayPlugin` 是插件必须符合的函数形态.

```ts
type OhDayPlugin = ((instance: typeof OhDay, factory: OhDayFactory) => void) & { $i?: boolean }
```

插件接收 `OhDay` 类和 `od` 工厂, 然后修改类原型以添加新方法. `$i` 标志插件是否已安装, 防止重复安装.

详见 [插件机制](../guide/concepts.md#插件机制), 内置示例见 [插件文档](../plugin/).
