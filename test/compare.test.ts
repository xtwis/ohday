import { od } from "@xtwis/ohday"
import { describe, expect, it } from "vitest"

describe("比较", () => {
  it("比较", () => {
    const d1 = "2023-10-01 12:30:45"
    const d2 = "2023-10-01 12:00:00"
    const d3 = "2023-10-02 00:00:00"
    const d4 = "2023-01-01 00:00:00"
    const d5 = "2023-10-01 12:30:45.999"
    expect(od(d1).eq(d2)).toBe(false)
    expect(od(d1).eq(d2, "h")).toBe(true)
    expect(od(d1).eq(d1)).toBe(true)
    expect(od(d1).gt(d2)).toBe(true)
    expect(od(d1).lt(d3)).toBe(true)
    expect(od(d1).lt(d3, "M")).toBe(false)
    expect(od(d1).gt(d4, "y")).toBe(false)
    expect(od(d1).ge(d4, "y")).toBe(true)
    expect(od(d1).lt(d5)).toBe(true)
    expect(od(d1).lt(d5, "s")).toBe(false)
  })

  it("范围", () => {
    const d1 = "2023-10-01 12:30:45"
    const d2 = "2023-10-01 00:00:00"
    const d3 = "2023-10-02 00:00:00"
    expect(od(d1).bt(d2, d3)).toBe(true)
    expect(od(d1).bt(d2, d3, "h")).toBe(true)
    expect(od(d1).bt(d2, d3, "d")).toBe(true)
  })
})
