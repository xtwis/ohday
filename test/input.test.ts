import type { OhDayLike } from "@xtwis/ohday"
import { od } from "@xtwis/ohday"
import dayjs from "dayjs"
import { describe, expect, it } from "vitest"

describe("输入", () => {
  it("date 对象", () => {
    const d = new Date()
    expect(od(d).s).toBe(dayjs(d).format("YYYY-MM-DD HH:mm:ss"))
  })

  it("ohday 对象", () => {
    const d1 = new Date()
    const d2 = od(d1)
    expect(od(d2).s).toBe(dayjs(d1).format("YYYY-MM-DD HH:mm:ss"))
  })

  it("时间戳", () => {
    const d = Date.now()
    expect(od(d).s).toBe(dayjs(d).format("YYYY-MM-DD HH:mm:ss"))
  })

  it("完整字符串", () => {
    const d1 = "2023-10-01 12:30:45"
    const d2 = "2023-10-01"
    const d3 = "12:30:45"
    const d4 = "2023-10-01 12:30:45.678"
    expect(od(d1).s).toBe("2023-10-01 12:30:45")
    expect(od(d2).s).toBe("2023-10-01 00:00:00")
    expect(od(d3).s).toBe(dayjs().format("YYYY-MM-DD 12:30:45"))
    expect(od(d4).s).toBe("2023-10-01 12:30:45")
  })

  it("分钟精度字符串", () => {
    expect(od("2023-09-28 08:00").s).toBe("2023-09-28 08:00:00")
    expect(od("2023-09-28T08:00").s).toBe("2023-09-28 08:00:00")
    expect(od("2023-09-28 08:00:00").s).toBe("2023-09-28 08:00:00")
    expect(od("2023-09-28T08:00:00").s).toBe("2023-09-28 08:00:00")
    expect(od("08:30").s).toBe(dayjs().format("YYYY-MM-DD 08:30:00"))
    expect(od("2023-09-28 08:00").diff("2023-10-01 12:30", "d")).toBe(-3)
    expect(od("2023-10-01").lt("2023-10-02 12:00")).toBe(true)
  })

  it("带时区后缀的 iso 格式字符串", () => {
    const d1 = "2023-10-01T12:30:45.678Z"
    const d2 = "2023-10-01T12:30:45Z"
    const d3 = "2023-10-01T12:30:45+08:00"
    expect(od(d1).s).toBe(dayjs(d1).format("YYYY-MM-DD HH:mm:ss"))
    expect(od(d1).ms).toBe(678)
    expect(od(d2).ts).toBe(dayjs(d2).valueOf())
    expect(od(d3).ts).toBe(dayjs(d3).valueOf())
    expect(od(d3).ms).toBe(0)
  })

  it("时间戳零与空值", () => {
    expect(od(0).ts).toBe(0)
    expect(od(0).s).toBe(dayjs(0).format("YYYY-MM-DD HH:mm:ss"))
    expect(Number.isNaN(od("").ts)).toBe(true)
    expect(Number.isNaN(od(null as unknown as OhDayLike).ts)).toBe(true)
  })

  it("非标准格式字符串", () => {
    const d1 = "2023/10/01 12:30:45"
    const d3 = "2023/10/01 12:30:45"
    const d4 = "2023-10-1 12:30:45"
    const d5 = "2023/10/1 12:30:45"
    const d6 = "2023-10-01 12:30:45.678"
    const d7 = "2023/10/01 12:30:45.678"

    expect(od(d1).s).toBe("2023-10-01 12:30:45")
    expect(od(d3).s).toBe("2023-10-01 12:30:45")
    expect(od(d4).s).toBe("2023-10-01 12:30:45")
    expect(od(d5).s).toBe("2023-10-01 12:30:45")
    expect(od(d6).s).toBe("2023-10-01 12:30:45")
    expect(od(d7).s).toBe("2023-10-01 12:30:45")
  })

  it("自定义格式字符串", () => {
    const d = "10/01 2023 12:30:45"
    expect(od(d, "MM/DD YYYY HH:mm:ss").s).toBe("2023-10-01 12:30:45")
    expect(od("23-10-01 12:30", "YY-MM-DD HH:mm").s).toBe("2023-10-01 12:30:00")
    expect(od("50-06-15", "YY-MM-DD").s).toBe("2050-06-15 00:00:00")
  })

  it("小于四位数的年份", () => {
    expect(od("0050-06-15").s).toBe("0050-06-15 00:00:00")
    expect(od("500-06-15").s).toBe("0500-06-15 00:00:00")
    expect(od("0050-06-15", "YYYY-MM-DD").s).toBe("0050-06-15 00:00:00")
    expect(od("15/06/500", "DD/MM/YYYY").s).toBe("0500-06-15 00:00:00")
    expect(od("15/06/0500", "DD/MM/YYYY").s).toBe("0500-06-15 00:00:00")
    expect(od([50, 6, 15]).s).toBe("0050-06-15 00:00:00")
    expect(od({ year: 50, month: 6, date: 15 }).s).toBe("0050-06-15 00:00:00")
    expect(od("2024-06-15").c("y", 50).s).toBe("0050-06-15 00:00:00")
    expect(od("2024-06-15").c("y", 50).pd().getFullYear()).toBe(50)
  })

  it("数组", () => {
    const d1 = [2023, 10, 1, 12, 30, 45]
    const d2 = [2023, 10, 1]
    expect(od(d1).s).toBe("2023-10-01 12:30:45")
    expect(od(d2).s).toBe("2023-10-01 00:00:00")
  })

  it("对象", () => {
    const d1 = { year: 2023, month: 10, date: 1, hour: 12, minute: 30, second: 45 }
    const d2 = { year: 2023, month: 10, date: 1 }
    expect(od(d1).s).toBe("2023-10-01 12:30:45")
    expect(od(d2).s).toBe("2023-10-01 00:00:00")
  })

  it("对象 day 字段", () => {
    expect(od({ year: 2023, month: 10, day: 3 }).s).toBe("2023-10-04 00:00:00")
    expect(od({ year: 2023, month: 10, date: 1, day: 3 }).s).toBe("2023-10-04 00:00:00")
    expect(od({ year: 2023, month: 10, day: 0 }).s).toBe("2023-10-01 00:00:00")
  })

  it("缺省测试", () => {
    const d1 = { year: 2023, month: 10 }
    const d2 = { year: 2023 }
    const d3 = { month: 10 }
    const d4 = { month: 10, date: 1 }
    const d5 = { hour: 12 }
    const d6 = { minute: 30 }
    expect(od(d1).s).toBe("2023-10-01 00:00:00")
    expect(od(d2).s).toBe("2023-01-01 00:00:00")
    expect(od(d3).s).toBe(dayjs().format("YYYY-10-01 00:00:00"))
    expect(od(d4).s).toBe(dayjs().format("YYYY-10-01 00:00:00"))
    expect(od(d5).s).toBe(dayjs().format("YYYY-MM-DD 12:00:00"))
    expect(od(d6).s).toBe(dayjs().format("YYYY-MM-DD 00:30:00"))
  })
})
