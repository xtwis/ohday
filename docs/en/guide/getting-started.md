---
title: Getting Started
order: 1
---

# {{ $frontmatter.title }}

Welcome to ohday. This page takes you from zero to your first chain in under five minutes.

## Installation

Install via your favorite package manager:

```bash
# pnpm
pnpm add @xtwis/ohday

# npm
npm install @xtwis/ohday

# yarn
yarn add @xtwis/ohday
```

**Requirements.** TypeScript 4.5+ or any modern JavaScript runtime.

## Your First Chain

A working call is two lines:

```ts
import { od } from "@xtwis/ohday"

const d = od("2023-10-01 12:30:45").c("M", 2).add("d", 10)
console.log(d.s) // "2023-02-11 12:30:45"
```

That is it. The result is the date with the month set to February and 10 days added, printed in the default `YYYY-MM-DD HH:mm:ss` format.

## What Just Happened

- `od("2023-10-01 12:30:45")` parses the input string and returns an OhDay instance.
- `.c("M", 2)` changes the month to February, returns a new instance.
- `.add("d", 10)` adds 10 days, returns another new instance.
- `.s` is a getter that prints the date in the default format.

Every method returns a new OhDay. The original is never modified, so it is safe to keep around and derive from.

## Adding a Plugin

Plugins are the main extension point. `fullname` is a built-in plugin that adds long-name aliases for every short method:

```ts
import { od } from "@xtwis/ohday"
import { fullname } from "@xtwis/ohday/plugin"

od.use(fullname)

const d = od("2023-10-01 12:30:45")
d.startOf("M").s // "2023-10-01 00:00:00"
d.isBefore("2024-01-01", "y") // true
```

`fullname` is installed once on the factory. Every OhDay instance created afterward sees the new methods. See the [Fullname Plugin](../plugin/fullname.md) for the full alias map.

## Next

- [Concepts](./concepts.md) for the mental model: flag, token, scope, unit, and immutability.
- Browse the rest of the guide from the sidebar.
