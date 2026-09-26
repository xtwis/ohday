import type { OhDay, OhDayPlugin } from "@xtwis/ohday"

declare module "@xtwis/ohday" {
  interface OhDayFactory {
    /**
     * Global switch for ISO 8601 week numbering (1=Monday..7=Sunday)
     *   - Passing `undefined` (no argument) enables it; a boolean sets it explicitly
     *   - Enabled by default once the plugin is installed
     * @returns The current global ISO-week state
     */
    isoWeek: (flag?: boolean) => boolean
    /**
     * Short-name alias of `isoWeek`
     * @see {@link OhDayFactory.isoWeek}
     */
    iw: (flag?: boolean) => boolean
  }

  interface OhDay {
    /**
     * @description Internal per-instance ISO-week override, propagated stickily across the chain
     * @internal
     */
    $iw?: boolean
    /**
     * @description Chainable switch to enable ISO week numbering for this instance and its descendants
     *   - Passing `undefined` (no argument) enables it; a boolean sets it explicitly
     */
    isoWeek: (flag?: boolean) => OhDay
    /**
     * @description Short-name alias of instance `isoWeek`
     * @see {@link OhDay.isoWeek}
     */
    iw: (flag?: boolean) => OhDay
    /**
     * @description Chainable switch to restore default week numbering (0=Sunday..6=Saturday)
     */
    normalWeek: () => OhDay
    /**
     * @description Short-name alias of `normalWeek`
     * @see {@link OhDay.normalWeek}
     */
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
