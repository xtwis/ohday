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

  it("iso 格式字符串", () => {
    const d = "2023-10-01T12:30:45.678Z"
    expect(od(d).s).toBe("2023-10-01 12:30:45")
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
