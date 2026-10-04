# @xtwis/ohday

Chainable, immutable, lightweight date/time processing library.

```ts
od().c("M", 2).add("d", 10).p("MM/DD YYYY")
```

- **Chainable API**: Concise method chaining for fluent date manipulation.
- **Immutable Design**: Every operation returns a new instance, safe to share across chains.
- **Tiny Bundle**: Comparable to dayjs, zero runtime dependencies.
- **Short API**: One or two character names where possible.
- **Rich Input**: String, array, object, Date, timestamp, and OhDay clone.
- **TypeScript-first**: Full type definitions included.

## Installation

```bash
pnpm add @xtwis/ohday
# or
npm install @xtwis/ohday
# or
yarn add @xtwis/ohday
```

## Quick Start

```ts
import { od } from "@xtwis/ohday"

const d = od("2023-10-01 12:30:45").c("M", 2).add("d", 10)
console.log(d.s) // "2023-02-11 12:30:45"
```

## Documentation

Full guides, API reference, and plugin docs live at:

- English: <https://x.twis.uk/en/ohday/>
- 简体中文: <https://x.twis.uk/zh/ohday/>

## License

ohday is licensed under a [MIT License](./LICENSE).
