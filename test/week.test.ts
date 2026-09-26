import { od } from "@xtwis/ohday"
import dayjs from "dayjs"
import { describe, expect, it } from "vitest"

describe("周操作 - c('w')", () => {
  it("修改到指定星期", () => {
    const d = new Date()
    expect(od(d).c("w", 0).ts).toBe(dayjs(d).day(0).valueOf())
    expect(od(d).c("w", 1).ts).toBe(dayjs(d).day(1).valueOf())
    expect(od(d).c("w", 5).ts).toBe(dayjs(d).day(5).valueOf())
    expect(od(d).c("w", 6).ts).toBe(dayjs(d).day(6).valueOf())
  })

  it("保持时间部分不变", () => {
    const d = od("2026-10-01 12:30:45")
    const r = d.c("w", 2)
    expect(r.hour).toBe(12)
    expect(r.minute).toBe(30)
    expect(r.second).toBe(45)
  })

  it("跨月边界", () => {
    // 2026-10-31 是周六(6), c("w", 0) 应该跳到周日 2026-10-25
    const d = od("2026-10-31 12:30:45")
    expect(d.c("w", 0).s).toBe("2026-10-25 12:30:45")
    // 2026-10-01 是周四(4), c("w", 6) 应该跳到周六 2026-10-03
    expect(od("2026-10-01 12:30:45").c("w", 6).s).toBe("2026-10-03 12:30:45")
  })
})

describe("周操作 - cs('w')", () => {
  it("跳到周日开始", () => {
    const d = new Date()
    expect(od(d).cs("w").ts).toBe(dayjs(d).startOf("week").valueOf())
  })

  it("跳到指定星期开始", () => {
    const d = new Date()
    expect(od(d).cs("w", 3).ts).toBe(dayjs(d).day(3).startOf("day").valueOf())
    expect(od(d).cs("w", 0).ts).toBe(dayjs(d).startOf("week").valueOf())
  })

  it("时间归零", () => {
    const d = od("2026-10-01 12:30:45")
    const r = d.cs("w")
    expect(r.hour).toBe(0)
    expect(r.minute).toBe(0)
    expect(r.second).toBe(0)
    expect(r.ms).toBe(0)
  })
})

describe("周操作 - ce('w')", () => {
  it("跳到周六结束", () => {
    const d = new Date()
    expect(od(d).ce("w").ts).toBe(dayjs(d).endOf("week").valueOf())
  })

  it("跳到指定星期结束", () => {
    const d = new Date()
    expect(od(d).ce("w", 4).ts).toBe(dayjs(d).day(4).endOf("day").valueOf())
    expect(od(d).ce("w", 6).ts).toBe(dayjs(d).endOf("week").valueOf())
  })

  it("时间归最大", () => {
    const d = od("2026-10-01 12:30:45")
    const r = d.ce("w")
    expect(r.hour).toBe(23)
    expect(r.minute).toBe(59)
    expect(r.second).toBe(59)
    expect(r.ms).toBe(999)
  })
})

describe("周操作 - add/sub('w')", () => {
  it("加减周", () => {
    const d = new Date()
    expect(od(d).add("w", 1).ts).toBe(dayjs(d).add(1, "week").valueOf())
    expect(od(d).add("w", 5).ts).toBe(dayjs(d).add(5, "week").valueOf())
    expect(od(d).sub("w", 1).ts).toBe(dayjs(d).subtract(1, "week").valueOf())
    expect(od(d).sub("w", 3).ts).toBe(dayjs(d).subtract(3, "week").valueOf())
  })

  it("负数加 = 减", () => {
    const d = new Date()
    expect(od(d).add("w", -2).ts).toBe(dayjs(d).subtract(2, "week").valueOf())
    expect(od(d).sub("w", -2).ts).toBe(dayjs(d).add(2, "week").valueOf())
  })

  it("保持星期不变", () => {
    // 2026-10-01 是周四(4), 加1周后还是周四
    const d = od("2026-10-01 12:30:45")
    const r = d.add("w", 1)
    expect(r.day).toBe(4)
    expect(r.date).toBe(8)
    expect(r.s).toBe("2026-10-08 12:30:45")
  })

  it("零周", () => {
    const d = od("2026-10-01")
    expect(d.add("w", 0).s).toBe(d.s)
  })
})

describe("周操作 - diff('w')", () => {
  it("整数周差", () => {
    const d1 = "2026-10-01 12:30:45"
    const d2 = "2026-10-08 12:30:45"
    expect(od(d1).diff(d2, "w")).toBe(dayjs(d1).diff(d2, "week"))
    expect(od(d2).diff(d1, "w")).toBe(dayjs(d2).diff(d1, "week"))
  })

  it("浮点周差", () => {
    const d1 = "2026-10-01 12:30:45"
    const d2 = "2026-10-05 12:30:45"
    expect(od(d1).diff(d2, "w", true)).toBe(dayjs(d1).diff(d2, "week", true))
    expect(od(d2).diff(d1, "w", true)).toBe(dayjs(d2).diff(d1, "week", true))
  })
})

describe("周操作 - len('w')", () => {
  it("一周的天数", () => {
    expect(od("2026-10-01").len("w", "d")).toBe(7)
  })

  it("一周的小时数", () => {
    expect(od("2026-10-01").len("w", "h")).toBe(168)
  })

  it("一周的毫秒数", () => {
    // len("w") 默认以毫秒为单位
    const d = od("2026-10-01")
    expect(d.len("w")).toBe(d.len("w", "ms"))
  })
})

describe("周操作 - pa/po/pd('w')", () => {
  it("pa('w') 输出 date 精度数组", () => {
    const d = od("2026-10-01 12:30:45")
    expect(d.pa("w")).toEqual([d.year, d.month, d.date])
  })

  it("po('w') 输出 date 精度对象", () => {
    const d = od("2026-10-01 12:30:45")
    expect(d.po("w")).toEqual({ year: d.year, month: d.month, date: d.date })
  })

  it("pd('w') 复用 pd('d')", () => {
    const d = od("2026-10-01 12:30:45")
    const r = od(d.pd("w"))
    expect(r.s).toBe("2026-10-01 00:00:00")
    expect(r.hour).toBe(0)
    expect(r.minute).toBe(0)
    expect(r.second).toBe(0)
  })
})

describe("周操作 - 不可变性", () => {
  it("操作不改变原实例", () => {
    const d = od("2026-10-01 12:30:45")
    const original = d.s
    d.c("w", 2)
    d.cs("w")
    d.ce("w")
    d.add("w", 1)
    d.sub("w", 1)
    expect(d.s).toBe(original)
  })
})
