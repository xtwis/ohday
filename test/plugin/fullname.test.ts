import { od } from "@xtwis/ohday"
import { fullname } from "@xtwis/ohday/plugin"
import { describe, expect, it } from "vitest"

od.use(fullname)

describe("插件 - fullname", () => {
  it("getter 方法", () => {
    const d = od("2023-10-01 12:30:45.678")
    expect(d.getString()).toBe(d.s)
    expect(d.getISOString()).toBe(d.iso)
    expect(d.getTime()).toBe(d.ts)
    expect(d.getTimeStamp()).toBe(d.ts)
    expect(d.getDateObject()).toEqual(d.dd)
    expect(d.getYear()).toBe(d.year)
    expect(d.getMonth()).toBe(d.month)
    expect(d.getDate()).toBe(d.date)
    expect(d.getHour()).toBe(d.hour)
    expect(d.getMinute()).toBe(d.minute)
    expect(d.getSecond()).toBe(d.second)
    expect(d.getMS()).toBe(d.ms)
    expect(d.getMilliseconds()).toBe(d.ms)
    const cloned = d.clone()
    expect(cloned).not.toBe(d)
    expect(cloned.s).toBe(d.s)
  })

  it("output 方法", () => {
    const d = od("2023-10-01 12:30:45")
    expect(d.format()).toBe(d.p())
    expect(d.print()).toBe(d.p())
    expect(d.toString()).toBe(d.p())
    expect(d.format("MM/DD YYYY")).toBe(d.p("MM/DD YYYY"))
    expect(d.printArray()).toEqual(d.pa())
    expect(d.toArray()).toEqual(d.pa())
    expect(d.printObject()).toEqual(d.po())
    expect(d.toObject()).toEqual(d.po())
    expect(d.printDate()).toEqual(d.pd())
    expect(d.toDate()).toEqual(d.pd())
    expect(d.toDateObject()).toEqual(d.pd())
  })

  it("manipulation 方法", () => {
    const d = "2023-10-01 12:30:45"
    expect(od(d).set("y", 2025).s).toBe(od(d).c("y", 2025).s)
    expect(od(d).change("y", 2025).s).toBe(od(d).c("y", 2025).s)
    expect(od(d).startOf("M").s).toBe(od(d).cs("M").s)
    expect(od(d).changeToStart("M").s).toBe(od(d).cs("M").s)
    expect(od(d).endOf("M").s).toBe(od(d).ce("M").s)
    expect(od(d).changeToEnd("M").s).toBe(od(d).ce("M").s)
    expect(od(d).get("y")).toBe(od(d).g("y"))
    expect(od(d).subtract("y", 1).s).toBe(od(d).sub("y", 1).s)
    expect(od(d).lengthOf("M", "d")).toBe(od(d).len("M", "d"))
    expect(od(d).getLength("M", "d")).toBe(od(d).len("M", "d"))
  })

  it("comparison 方法", () => {
    const a = od("2023-10-01 12:30:45")
    const b = od("2023-10-02")
    expect(a.isSame(a)).toBe(a.eq(a))
    expect(a.isEqual(a)).toBe(a.eq(a))
    expect(a.isBefore(b)).toBe(a.lt(b))
    expect(a.isLessThan(b)).toBe(a.lt(b))
    expect(b.isAfter(a)).toBe(b.gt(a))
    expect(b.isGreaterThan(a)).toBe(b.gt(a))
    expect(a.isSameOrBefore(a)).toBe(a.le(a))
    expect(a.isBeforeOrSame(a)).toBe(a.le(a))
    expect(a.isLessOrEqual(a)).toBe(a.le(a))
    expect(a.isSameOrAfter(a)).toBe(a.ge(a))
    expect(a.isAfterOrSame(a)).toBe(a.ge(a))
    expect(a.isGreaterOrEqual(a)).toBe(a.ge(a))
    expect(a.isBetween(a, b)).toBe(a.bt(a, b))
  })
})
