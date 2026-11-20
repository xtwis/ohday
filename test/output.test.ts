import type { OhDayLike } from "@xtwis/ohday"
import { od } from "@xtwis/ohday"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { describe, expect, it } from "vitest"

dayjs.extend(duration)

describe("输出", () => {
  it("简单输出", () => {
    const d = new Date()
    expect(od(d).s).toBe(dayjs(d).format("YYYY-MM-DD HH:mm:ss"))
    expect(od(d).ts).toBe(dayjs(d).valueOf())
    expect(od(d).iso).toBe(dayjs(d).toISOString())
    expect(od(d).dd).toEqual(dayjs(d).toDate())
    expect(od(d).year).toBe(dayjs(d).year())
    expect(od(d).month).toBe(dayjs(d).month() + 1)
    expect(od(d).date).toBe(dayjs(d).date())
    expect(od(d).hour).toBe(dayjs(d).hour())
    expect(od(d).minute).toBe(dayjs(d).minute())
    expect(od(d).second).toBe(dayjs(d).second())
    expect(od(d).ms).toBe(dayjs(d).millisecond())
  })

  it("有效性", () => {
    expect(od("2023-10-01 12:30:45").ok).toBe(true)
    expect(od("2023-10-01").ok).toBe(true)
    expect(od(0).ok).toBe(true)
    expect(od("bad").ok).toBe(false)
    expect(od("").ok).toBe(false)
    expect(od(null as unknown as OhDayLike).ok).toBe(false)
    expect(od(new Date(Number.NaN)).ok).toBe(false)
  })

  it("字符串", () => {
    const d = new Date()
    expect(od(d).p()).toBe(dayjs(d).format("YYYY-MM-DD HH:mm:ss"))
    expect(od(d).p("MM/DD YYYY HH:mm:ss SSS")).toBe(dayjs(d).format("MM/DD YYYY HH:mm:ss SSS"))
    expect(od(d).p("M/D YY H:m:s")).toBe(dayjs(d).format("M/D YY H:m:s"))
  })

  it("年份补零", () => {
    expect(od("2024-06-15").c("y", 50).p("YYYY-MM-DD")).toBe("0050-06-15")
    expect(od("2024-06-15").c("y", 50).p("YY-MM-DD")).toBe("50-06-15")
    expect(od("2024-06-15").c("y", 950).p("YYYY-MM-DD")).toBe("0950-06-15")
    expect(od("0500-06-15").p("DD/MM/YYYY")).toBe("15/06/0500")
  })

  it("未知 token 与转义", () => {
    expect(od("2023-10-05").p("MMMM")).toBe("MMMM")
    expect(od("2023-10-05").p("dddd")).toBe("dddd")
    expect(od("2023-10-05").p("DDDD")).toBe("DDDD")
    expect(od("2023-10-05").p("[Year] YYYY")).toBe("Year 2023")
    expect(od("2023-10-05").p("[YYYY]")).toBe("YYYY")
  })

  it("数组", () => {
    const d1 = new Date()
    const d2 = dayjs(d1)
    expect(od(d1).pa()).toEqual([d2.year(), d2.month() + 1, d2.date(), d2.hour(), d2.minute(), d2.second(), d2.millisecond()])
    expect(od(d1).pa("h")).toEqual([d2.year(), d2.month() + 1, d2.date(), d2.hour()])
    expect(od(d1).pa("d")).toEqual([d2.year(), d2.month() + 1, d2.date()])
    expect(od(d1).pa("y")).toEqual([d2.year()])
  })

  it("对象", () => {
    const d1 = new Date()
    const d2 = dayjs(d1)
    expect(od(d1).po()).toEqual({ year: d2.year(), month: d2.month() + 1, date: d2.date(), hour: d2.hour(), minute: d2.minute(), second: d2.second(), ms: d2.millisecond() })
    expect(od(d1).po("h")).toEqual({ year: d2.year(), month: d2.month() + 1, date: d2.date(), hour: d2.hour() })
    expect(od(d1).po("d")).toEqual({ year: d2.year(), month: d2.month() + 1, date: d2.date() })
    expect(od(d1).po("y")).toEqual({ year: d2.year() })
  })

  it("date 对象", () => {
    const d1 = new Date()
    const d2 = dayjs(d1)
    expect(od(d1).pd()).toEqual(d2.toDate())
    expect(od(d1).pd("h")).toEqual(d2.startOf("h").toDate())
    expect(od(d1).pd("d")).toEqual(d2.startOf("d").toDate())
    expect(od(d1).pd("y")).toEqual(d2.startOf("y").toDate())
  })
})
