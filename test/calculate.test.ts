import { od } from "@xtwis/ohday"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import isLeapYear from "dayjs/plugin/isLeapYear"
import { describe, expect, it } from "vitest"

dayjs.extend(duration)
dayjs.extend(isLeapYear)

describe("计算", () => {
  it("加减指定单位", () => {
    const d = new Date()
    expect(od(d).add("y", 1).ts).toBe(dayjs(d).add(1, "y").valueOf())
    expect(od(d).add("M", 2).ts).toBe(dayjs(d).add(2, "M").valueOf())
    expect(od(d).add("d", 3).ts).toBe(dayjs(d).add(3, "d").valueOf())
    expect(od(d).add("h", 4).ts).toBe(dayjs(d).add(4, "h").valueOf())
    expect(od(d).add("m", 30).ts).toBe(dayjs(d).add(30, "m").valueOf())
    expect(od(d).add("s", 30).ts).toBe(dayjs(d).add(30, "s").valueOf())
    expect(od(d).add("ms", 500).ts).toBe(dayjs(d).add(500, "ms").valueOf())
    expect(od(d).sub("y", 1).ts).toBe(dayjs(d).subtract(1, "y").valueOf())
    expect(od(d).sub("M", 2).ts).toBe(dayjs(d).subtract(2, "M").valueOf())
    expect(od(d).sub("d", 3).ts).toBe(dayjs(d).subtract(3, "d").valueOf())
    expect(od(d).sub("h", 4).ts).toBe(dayjs(d).subtract(4, "h").valueOf())
    expect(od(d).sub("m", 30).ts).toBe(dayjs(d).subtract(30, "m").valueOf())
    expect(od(d).sub("s", 30).ts).toBe(dayjs(d).subtract(30, "s").valueOf())
    expect(od(d).sub("ms", 500).ts).toBe(dayjs(d).subtract(500, "ms").valueOf())
  })

  it("加减负数处理", () => {
    const d = new Date()
    expect(od(d).add("y", -1).ts).toBe(dayjs(d).subtract(1, "y").valueOf())
    expect(od(d).sub("M", -2).ts).toBe(dayjs(d).add(2, "M").valueOf())
  })

  it("加减日期溢出", () => {
    const d1 = "2023-10-31 12:30:45"
    const d2 = "2024-02-29 12:30:45"
    expect(od(d1).add("M", 1).s).toBe("2023-11-30 12:30:45")
    expect(od(d2).sub("y", 1).s).toBe("2023-02-28 12:30:45")
  })

  it("间隔计算", () => {
    const d1 = new Date()
    const d2 = "2023-10-01 12:30:45"
    expect(od(d1).diff(d2, "y")).toBe(dayjs(d1).diff(d2, "y"))
    expect(od(d1).diff(d2, "M")).toBe(dayjs(d1).diff(d2, "M"))
    expect(od(d1).diff(d2, "d")).toBe(dayjs(d1).diff(d2, "d"))
    expect(od(d1).diff(d2, "h")).toBe(dayjs(d1).diff(d2, "h"))
    expect(od(d1).diff(d2, "m")).toBe(dayjs(d1).diff(d2, "m"))
    expect(od(d1).diff(d2, "s")).toBe(dayjs(d1).diff(d2, "s"))
    expect(od(d1).diff(d2, "ms")).toBe(dayjs(d1).diff(d2, "ms"))

    expect(od(d2).diff(d1, "y")).toBe(dayjs(d2).diff(d1, "y"))
    expect(od(d2).diff(d1, "M")).toBe(dayjs(d2).diff(d1, "M"))
    expect(od(d2).diff(d1, "d")).toBe(dayjs(d2).diff(d1, "d"))
    expect(od(d2).diff(d1, "h")).toBe(dayjs(d2).diff(d1, "h"))
    expect(od(d2).diff(d1, "m")).toBe(dayjs(d2).diff(d1, "m"))
    expect(od(d2).diff(d1, "s")).toBe(dayjs(d2).diff(d1, "s"))
    expect(od(d2).diff(d1, "ms")).toBe(dayjs(d2).diff(d1, "ms"))
  })

  it("时长计算", () => {
    const d = new Date()
    expect(od(d).len("d")).toBe(dayjs.duration(1, "d").asMilliseconds())
    expect(od(d).len("M", "d")).toBe(dayjs(d).add(1, "M").date(0).date())
    expect(od(d).len("y", "h")).toBe(dayjs(d).isLeapYear() ? 366 * 24 : 365 * 24)
    expect(od(d).len("m", "h")).toBe(0)
  })
})
