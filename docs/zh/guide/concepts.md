---
title: 核心概念
order: 2
---

# {{ $frontmatter.title }}

在逐个讲解方法之前, 本页勾勒 ohday 的整体设计. 这个库很小, 指南的其余部分只是在枚举每个部分能做什么.

## 设计哲学

三个承诺决定每一个 API 选择:

- **链式不可变设计.** 每个方法都返回新的 OhDay, 链式调用可以安全地分叉.
- **短且统一的命名.** 方法名尽可能短, 在保证可读性的前提下压缩至很少的字符. 参数名统一.
- **零依赖.** 运行时不需要打包任何第三方代码.

这三点共同构成一个库: 小到可以内联, 快到可以在紧循环里调用, 简单到不看源码也能推断行为.

## 基础模型

ohday 运行在一个轻量的对象模型上: 一个 `OhDay` 实例把 `Date` 包起来, 每个方法要么读取这个 `Date`, 要么把它变换成新的, 要么和目标比较. 几个小概念承担其余的描述工作.

### Flag

`OhDayFlag` 是 API 中作为方法参数出现的时间单位的联合: `.c("M", 2)`, `.add("d", 10)`, `.lt(target, "y")`.

Flag 用在所有问 "哪个时间单位?" 的方法里. 有两个 Flag 跟直觉不同: `M` 是月, 不是分 (小写 `m` 才是分); `w` 是周几 (0 到 6), 不是周这个时长单位.

完整列表见 [API 参考](./reference/types.md#flag).

### Token

`OhDayToken` 是出现在格式串里的格式 token 联合.

Token 同时驱动格式化器的两个方向: `p(fmt)` 生成输出, `od(str, fmt)` 解析输入. 双向共用同一套词汇, 因此你能打印出来的就能再解析回去.

完整列表见 [API 参考](./reference/types.md#token).

### Scope 和 Unit

这两个词听起来相近, 但含义不同:

- **Scope** 是操作作用的时间维度. 它是 `c`, `cs`, `ce`, `add`, `sub`, `len` 的第一个参数, 也是比较方法可选的第二个参数. `c("M", 2)` 作用在月这个 scope 上.
- **Unit** 是结果的度量单位. 它是 `diff` 和 `len` 可选的第二个参数. `diff(target, "d")` 返回以天为单位的差.

两个参数都用同一套 `OhDayFlag` 值, 区别只在语义.

### OhDayLike

绝大多数接受 `target` 的方法 (`diff` 以及所有比较方法) 都接受任何 `OhDayLike`. 这是覆盖所有日期表达方式的单一联合类型: `Date` 对象, 另一个 `OhDay` 实例 (克隆), 字符串 (自动识别或自定义格式解析), 数字 (Unix 时间戳, 毫秒), 数字数组 `[year, month, date, hour, minute, second, ms?]`, 对象 `{ year, month, date, day, hour, minute, second, ms }`. 构造 OhDay 时所用的缺省规则在这里同样适用.

完整解析规则见 [输入](./input.md).

## 核心操作

五大类覆盖了 API 的全部:

| 类别 | 方法                                                             | 指南                   |
| ---- | ---------------------------------------------------------------- | ---------------------- |
| 输入 | `od(input, format?)`                                             | [输入](./input.md)     |
| 变更 | `c`, `cs`, `ce`                                                  | [变更](./change.md)    |
| 计算 | `add`, `sub`, `diff`, `len`                                      | [计算](./calculate.md) |
| 比较 | `lt`, `gt`, `eq`, `le`, `ge`, `bt`                               | [比较](./compare.md)   |
| 输出 | `s`, `iso`, `ts`, `dd`, `g`, `p`, `pa`, `po`, `pd` 与命名 getter | [输出](./output.md)    |

按你的目标选类别. 大部分链式调用会经过其中两到三类.

## 插件机制

插件是一个函数, 接收 OhDay 类和 od 工厂, 然后修改类的原型来添加新方法. 工厂暴露一个 `use` 方法, 运行插件一次, 并防止重复安装:

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

为了让新方法在 TypeScript 里可见, 插件文件需要扩展模块:

```ts
declare module "@xtwis/ohday" {
  interface OhDay {
    tomorrow: () => OhDay
  }
}
```

完整示例见 [Fullname 插件](../plugin/fullname.md) 和 [ISO Week 插件](../plugin/iso-week.md).

## 下一步

- 通过侧边栏浏览指南的其余部分.
