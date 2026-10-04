---
title: OhDay 类
order: 1
---

# OhDay 类

`OhDay` 类包装 `Date`, 提供完整的 API. 本页列举所有公开成员: 构造器, getter, 方法, 以及 `od` 工厂.

## 构造器

```ts
type OhDayConstructor = new (input?: OhDayLike, format?: string) => OhDay
```

创建一个新的 `OhDay` 实例.

| 参数     | 类型         | 说明                                                                     |
| -------- | ------------ | ------------------------------------------------------------------------ |
| `input`  | `OhDayLike?` | 待解析的日期. 见 [OhDayLike](./types.md#ohdaylike). 默认为 `new Date()`. |
| `format` | `string?`    | 自定义格式串. 仅当 `input` 是字符串时使用.                               |

解析出的 `Date` 存在内部, 通过下面的 getter 与方法访问. 应用代码不应直接读内部字段.

## Getter

| Getter   | 类型     | 说明                           |
| -------- | -------- | ------------------------------ |
| `s`      | `string` | 默认格式 `YYYY-MM-DD HH:mm:ss` |
| `iso`    | `string` | ISO 8601 格式                  |
| `ts`     | `number` | Unix 时间戳, 毫秒              |
| `dd`     | `Date`   | 内部 `Date` 的克隆             |
| `year`   | `number` | 年 (例如 `2023`)               |
| `month`  | `number` | 月, 1 到 12                    |
| `date`   | `number` | 日, 1 到 31                    |
| `day`    | `number` | 周几, 0 (周日) 到 6 (周六)     |
| `hour`   | `number` | 时, 0 到 23                    |
| `minute` | `number` | 分, 0 到 59                    |
| `second` | `number` | 秒, 0 到 59                    |
| `ms`     | `number` | 毫秒, 0 到 999                 |
| `od`     | `OhDay`  | 自身的克隆                     |

### g(scope?)

`get`: 返回给定 scope 处的值. 不传参数时返回时间戳 (与 `ts` 相同).

```ts
function g(scope?: OhDayFlag): number
```

`w` 返回周几; 其他 scope 返回对应的单位值.

命名 getter 见 [输出](../guide/output.md), scope 语义见 [核心概念](../guide/concepts.md#scope-and-unit).

## 变更

### c(scope, value)

`change`: 把给定 scope 的字段设为给定 value.

```ts
function c(scope: OhDayFlag, value: number): OhDay
```

变更导致日期越界时, ohday 回退到目标月的最后一天. 见 [变更](../guide/change.md).

### cs(scope, value?)

`change to start`: 把给定 scope 的字段设为给定 value, 再把下面所有字段清零.

```ts
function cs(scope: OhDayFlag, value?: number): OhDay
```

### ce(scope, value?)

`change to end`: 把给定 scope 的字段设为最大值, 再把下面所有字段填到各自层级的最大值.

```ts
function ce(scope: OhDayFlag, value?: number): OhDay
```

## 计算

### add(scope, offset)

把给定 scope 的字段加 offset.

```ts
function add(scope: OhDayFlag, offset: number): OhDay
```

继承 `c` 的溢出处理. 等价于 `c(scope, g(scope) + offset)`.

### sub(scope, offset)

把给定 scope 的字段减 offset.

```ts
function sub(scope: OhDayFlag, offset: number): OhDay
```

等价于 `add(scope, -offset)`.

### diff(target, unit?, float?)

返回当前日期与 `target` 的差. 不传 `unit` 时结果以毫秒为单位.

```ts
function diff(target: OhDayLike, unit?: OhDayFlag, float?: boolean): number
```

`float` 在整数 (`Math.trunc`) 与浮点之间切换. `y` 与 `M` 带符号校正, 其他单位不校正. 见 [计算](../guide/calculate.md).

### len(scope, unit?, float?)

返回给定 scope 的字段长度, 以给定 unit 度量.

```ts
function len(scope: OhDayFlag, unit?: OhDayFlag, float?: boolean): number
```

内部等价于 `cs(scope).add(scope, 1).diff(cs(scope), unit)`.

## 比较

五种直接比较加一个范围检查, 都返回 boolean.

传 `scope` 时, 比较前两侧先对齐到该 scope 的起点.

### lt(target, scope?)

`lt`: 判断是否小于 target 在给定 scope 下.

```ts
function lt(target: OhDayLike, scope?: OhDayFlag): boolean
```

### gt(target, scope?)

`gt`: 判断是否大于 target 在给定 scope 下.

```ts
function gt(target: OhDayLike, scope?: OhDayFlag): boolean
```

### eq(target, scope?)

`eq`: 判断是否等于 target 在给定 scope 下.

```ts
function eq(target: OhDayLike, scope?: OhDayFlag): boolean
```

### le(target, scope?)

`le`: 判断是否小于等于 target 在给定 scope 下.

```ts
function le(target: OhDayLike, scope?: OhDayFlag): boolean
```

### ge(target, scope?)

`ge`: 判断是否大于等于 target 在给定 scope 下.

```ts
function ge(target: OhDayLike, scope?: OhDayFlag): boolean
```

### bt(target1, target2, scope?)

`between`: 判断是否位于 `target1` 与 `target2` 之间, 左闭右开.

```ts
function bt(target1: OhDayLike, target2: OhDayLike, scope?: OhDayFlag): boolean
```

等价于 `ge(target1, scope) && lt(target2, scope)`. 见 [比较](../guide/compare.md).

## 输出

### p(format?)

`print`: 按格式串输出字符串.

```ts
function p(format?: string): string
```

默认格式是 `YYYY-MM-DD HH:mm:ss`. 不传参数时与 `.s` getter 等价. 见 [输出](../guide/output.md).

### pa(scope?)

`print as array`: 按给定精度输出 `number[]`.

```ts
function pa(scope?: OhDayFlag): number[]
```

`pa("w")` 与 `pa("d")` 相同.

### po(scope?)

`print as object`: 按给定精度输出 `Record<string, number>`.

```ts
function po(scope?: OhDayFlag): Record<string, number>
```

### pd(scope?)

`print as date`: 按给定精度输出 `Date` 对象, 对齐到 scope 的 **起点**.

```ts
function pd(scope?: OhDayFlag): Date
```

这是对齐, 不是截断. 若要截断, 先 `cs(scope)` 再 `pd()`.

## 工厂

`od` 工厂用于创建 `OhDay` 实例与安装插件.

### od(input?, format?)

创建一个新的 `OhDay` 实例.

```ts
function od(input?: OhDayLike, format?: string): OhDay
```

等价于 `new OhDay(input, format)`. 解析规则见 [输入](../guide/input.md).

### od.use(plugin)

安装插件.

```ts
function use(plugin: OhDayPlugin): OhDayFactory
```

插件接收 `OhDay` 类与 `od` 工厂, 然后修改类原型以添加新方法. 插件只安装一次, 函数上的 `$i` 标志防止重复安装.

详见 [核心概念 - 插件机制](../guide/concepts.md#插件机制), 内置示例见 [插件文档](../plugin/).
