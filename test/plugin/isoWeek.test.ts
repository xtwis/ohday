import { od } from "@xtwis/ohday"
import { isoWeek } from "@xtwis/ohday/plugin"
import dayjs from "dayjs"
import isoWeekPlugin from "dayjs/plugin/isoWeek"
import { afterEach, describe, expect, it } from "vitest"

dayjs.extend(isoWeekPlugin)
od.use(isoWeek)

// 2026-08-02 is Sunday, 2026-08-03 is Monday
const SUNDAY = "2026-08-02 12:30:45"
const MONDAY = "2026-08-03 12:30:45"

// Reset global switch after each test to avoid cross-test pollution
afterEach(() => {
  od.isoWeek(true)
})

describe("插件 - isoWeek 全局", () => {
  it("挂载后默认启用", () => {
    expect(od.isoWeek()).toBe(true)
    expect(od(SUNDAY).day).toBe(7)
    expect(od(MONDAY).day).toBe(1)
  })

  it("od.isoWeek(false) 关闭回到 0-6", () => {
    expect(od.isoWeek(false)).toBe(false)
    expect(od(SUNDAY).day).toBe(0)
    expect(od(MONDAY).day).toBe(1)
  })

  it("od.iw() 短名签名一致, 留空启用", () => {
    expect(od.iw(false)).toBe(false)
    expect(od.iw()).toBe(true) // 留空启用
    expect(od(SUNDAY).day).toBe(7)
  })

  it(".day 与 dayjs isoWeekday 对拍", () => {
    const d = new Date()
    expect(od(d).day).toBe(dayjs(d).isoWeekday())
  })
})

describe("插件 - isoWeek 输入", () => {
  it("c('w', v) 按 ISO 编号定位", () => {
    // ISO 下周日=7 是周末, 该周的周一(1)在其 6 天前
    expect(od(SUNDAY).c("w", 1).s).toBe("2026-07-27 12:30:45")
    expect(od(SUNDAY).c("w", 7).s).toBe("2026-08-02 12:30:45")
    // 周一(2026-08-03)所在 ISO 周的周日(7)在其 6 天后
    expect(od(MONDAY).c("w", 7).s).toBe("2026-08-09 12:30:45")
  })

  it("cs('w') 吸附到周一 00:00", () => {
    const r = od(SUNDAY).cs("w")
    expect(r.s).toBe("2026-07-27 00:00:00")
    expect(r.day).toBe(1)
  })

  it("ce('w') 吸附到周日 23:59", () => {
    const r = od(MONDAY).ce("w")
    expect(r.s).toBe("2026-08-09 23:59:59")
    expect(r.day).toBe(7)
  })

  it("cs/ce('w') 与 dayjs isoWeek 边界对拍", () => {
    const d = new Date()
    expect(od(d).cs("w").ts).toBe(dayjs(d).startOf("isoWeek").valueOf())
    expect(od(d).ce("w").ts).toBe(dayjs(d).endOf("isoWeek").valueOf())
  })

  it("关闭后 cs/ce 回到周日/周六", () => {
    od.isoWeek(false)
    expect(od(SUNDAY).cs("w").day).toBe(0)
    expect(od(SUNDAY).ce("w").day).toBe(6)
  })
})

describe("插件 - isoWeek 链式局部开关", () => {
  it("od().nw() 局部关闭", () => {
    expect(od(SUNDAY).nw().day).toBe(0)
    expect(od(SUNDAY).nw().cs("w").day).toBe(0)
    // 全局仍启用
    expect(od(SUNDAY).day).toBe(7)
  })

  it("od().isoWeek()/iw() 在全局关闭时局部启用", () => {
    od.isoWeek(false)
    expect(od(SUNDAY).isoWeek().day).toBe(7)
    expect(od(SUNDAY).iw().day).toBe(7)
    expect(od(SUNDAY).iw(false).day).toBe(0)
  })

  it("粘性下传: 标记随链条传递", () => {
    // 全局启用, 局部关闭后经过 add 仍保持关闭
    const r = od(SUNDAY).nw().add("d", 0)
    expect(r.day).toBe(0)
    expect(r.cs("w").day).toBe(0)
    // 全局关闭, 局部启用后经过 add 仍保持启用
    od.isoWeek(false)
    const r2 = od(SUNDAY).iw().add("d", 0)
    expect(r2.day).toBe(7)
    expect(r2.cs("w").day).toBe(1)
  })
})

describe("插件 - isoWeek 幂等", () => {
  it("重复 use 不二次包裹", () => {
    od.use(isoWeek)
    od.use(isoWeek)
    // 周日仍是 7 而非 7 被叠加
    expect(od(SUNDAY).day).toBe(7)
  })

  it("操作不改变原实例", () => {
    const d = od(SUNDAY)
    const original = d.s
    d.nw()
    d.iw()
    d.cs("w")
    expect(d.s).toBe(original)
  })
})
