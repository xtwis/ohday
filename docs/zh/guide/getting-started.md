---
title: 快速开始
order: 1
---

# {{ $frontmatter.title }}

欢迎使用 ohday. 本页带你从零开始, 五分钟内跑出第一条链式调用.

## 安装

通过你常用的包管理器安装:

```bash
# pnpm
pnpm add @xtwis/ohday

# npm
npm install @xtwis/ohday

# yarn
yarn add @xtwis/ohday
```

**环境要求.** TypeScript 4.5+ 或任何现代 JavaScript 运行时.

## 你的第一条链

一个能跑的调用只要两行:

```ts
import { od } from "@xtwis/ohday"

const d = od("2023-10-01 12:30:45").c("M", 2).add("d", 10)
console.log(d.s) // "2023-02-11 12:30:45"
```

这就完了. 结果是一个把月份改成 2 月并加了 10 天的日期, 按默认的 `YYYY-MM-DD HH:mm:ss` 格式输出.

## 刚刚发生了什么

- `od("2023-10-01 12:30:45")` 解析输入字符串, 返回一个 OhDay 实例.
- `.c("M", 2)` 把月份改成 2 月, 返回一个新实例.
- `.add("d", 10)` 加 10 天, 再返回一个新实例.
- `.s` 是一个 getter, 按默认格式输出日期.

每个方法都返回新的 OhDay. 原实例永远不会被修改, 因此可以放心保留和派生.

## 加入插件

插件是主要的扩展点. `fullname` 是一个内置插件, 给每个短方法补一份长名别名:

```ts
import { od } from "@xtwis/ohday"
import { fullname } from "@xtwis/ohday/plugin"

od.use(fullname)

const d = od("2023-10-01 12:30:45")
d.startOf("M").s // "2023-10-01 00:00:00"
d.isBefore("2024-01-01", "y") // true
```

`fullname` 在工厂上只安装一次. 之后创建的每个 OhDay 实例都能看到这些新方法. 完整的别名表见 [Fullname 插件](../plugin/fullname.md).

## 下一步

- [核心概念](./concepts.md): flag, token, scope, unit 以及不可变性的心智模型.
- 通过侧边栏浏览指南的其余部分.
