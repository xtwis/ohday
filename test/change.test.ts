import { od } from "@xtwis/ohday"
import dayjs from "dayjs"
import { describe, expect, it } from "vitest"

describe("操作", () => {
  it("修改指定单位", () => {
    const d = new Date()
    expect(od(d).c("y", 2024).ts).toBe(dayjs(d).year(2024).valueOf())
    expect(od(d).c("M", 11).ts).toBe(dayjs(d).month(10).valueOf())
    expect(od(d).c("d", 15).ts).toBe(dayjs(d).date(15).valueOf())
    expect(od(d).c("h", 18).ts).toBe(dayjs(d).hour(18).valueOf())
    expect(od(d).c("m", 45).ts).toBe(dayjs(d).minute(45).valueOf())
    expect(od(d).c("s", 30).ts).toBe(dayjs(d).second(30).valueOf())
    expect(od(d).c("ms", 500).ts).toBe(dayjs(d).millisecond(500).valueOf())
  })

  it("修改至指定时间起始", () => {
    const d = new Date()
    expect(od(d).cs("y").ts).toBe(dayjs(d).startOf("y").valueOf())
    expect(od(d).cs("M", 9).ts).toBe(dayjs(d).month(8).startOf("M").valueOf())
    expect(od(d).cs("m", 30).ts).toBe(dayjs(d).minute(30).startOf("m").valueOf())
  })

  it("修改至指定时间结束", () => {
    const d = new Date()
    expect(od(d).ce("y").ts).toBe(dayjs(d).endOf("y").valueOf())
    expect(od(d).ce("M", 9).ts).toBe(dayjs(d).month(8).endOf("M").valueOf())
    expect(od(d).ce("m", 30).ts).toBe(dayjs(d).minute(30).endOf("m").valueOf())
  })

  it("日期溢出", () => {
    const d1 = "2023-10-31 12:30:45"
    const d2 = "2024-02-29 12:30:45"
    expect(od(d1).c("M", 11).s).toBe("2023-11-30 12:30:45")
    expect(od(d2).c("y", 2023).s).toBe("2023-02-28 12:30:45")
  })
})
