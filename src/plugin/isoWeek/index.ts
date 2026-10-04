import type { OhDay, OhDayPlugin } from "@xtwis/ohday"

/**
 * @description Switches ohday from default (Sun=0) to ISO 8601 (Mon=1) week numbering. See the docs site for usage.
 * @see https://x.twis.uk/en/ohday/plugin/iso-week.html
 */
declare module "@xtwis/ohday" {
  interface OhDayFactory {
    isoWeek: (flag?: boolean) => boolean
    iw: (flag?: boolean) => boolean
  }

  interface OhDay {
    /**
     * @description Internal per-instance ISO-week override.
     * @internal
     */
    $iw?: boolean
    isoWeek: (flag?: boolean) => OhDay
    iw: (flag?: boolean) => OhDay
    normalWeek: () => OhDay
    nw: () => OhDay
  }
}

export const isoWeek: OhDayPlugin = (instance, factory) => {
  // Global switch, enabled by default on install
  let globalIso = true

  // Effective state: per-instance override wins, otherwise the global switch
  const eff = (self: OhDay): boolean => self.$iw ?? globalIso

  // region Factory configuration (global)
  const setGlobal = (flag?: boolean): boolean => {
    globalIso = flag ?? true
    return globalIso
  }
  factory.isoWeek = setGlobal
  factory.iw = setGlobal
  // endregion

  // region Output: remap day getter (g("w") and c("w") both compose via this.day)
  const desc = Object.getOwnPropertyDescriptor(instance.prototype, "day")!
  const origGet = desc.get!
  Object.defineProperty(instance.prototype, "day", {
    ...desc,
    get(this: OhDay) {
      const n = origGet.call(this) // 0(Sun)..6(Sat)
      return eff(this) && n === 0 ? 7 : n // ISO: 1(Mon)..7(Sun)
    },
  })
  // endregion

  // region Sticky propagation: $iw is intrinsic state, carried onto every clone
  // Clone via `.od` getter (new OhDay(this)) — the canonical clone path
  const desc$od = Object.getOwnPropertyDescriptor(instance.prototype, "od")!
  const origOdGet = desc$od.get!
  Object.defineProperty(instance.prototype, "od", {
    ...desc$od,
    get(this: OhDay) {
      const r = origOdGet.call(this)
      r.$iw = this.$iw
      return r
    },
  })

  // Derivations via `c()` build `new OhDay(date)` directly, so carry $iw there too
  const origC = instance.prototype.c
  instance.prototype.c = function (scope, value) {
    const r = origC.call(this, scope, value)
    r.$iw = this.$iw
    return r
  }
  // endregion

  // region Input: only cs/ce hardcoded defaults bypass the remap above
  const origCs = instance.prototype.cs
  instance.prototype.cs = function (scope, value) {
    if (scope === "w")
      return this.c("w", value ?? (eff(this) ? 1 : 0)).cs("d")
    return origCs.call(this, scope, value)
  }

  const origCe = instance.prototype.ce
  instance.prototype.ce = function (scope, value) {
    if (scope === "w")
      return this.c("w", value ?? (eff(this) ? 7 : 6)).ce("d")
    return origCe.call(this, scope, value)
  }
  // endregion

  // region Chainable switches (instance) — immutable: return a new instance
  //   carrying the week-start flag, never mutate the receiver
  instance.prototype.isoWeek = function (flag?: boolean) {
    const r = this.od // clone (preserves other state); set only the flag
    r.$iw = flag ?? true
    return r
  }
  instance.prototype.iw = instance.prototype.isoWeek
  instance.prototype.normalWeek = function () {
    const r = this.od
    r.$iw = false
    return r
  }
  instance.prototype.nw = instance.prototype.normalWeek
  // endregion
}
