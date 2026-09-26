import type { OhDay, OhDayPlugin } from "@xtwis/ohday"

declare module "@xtwis/ohday" {
  interface OhDay {
    // region Information (getter aliases)
    /**
     * @description Full-name alias of getter `s`
     * @see {@link OhDay.s}
     */
    getString: () => string
    /**
     * @description Full-name alias of getter `iso`
     * @see {@link OhDay.iso}
     */
    getISOString: () => string
    /**
     * @description Full-name alias of getter `ts`
     * @see {@link OhDay.ts}
     */
    getTime: () => number
    /**
     * @description Full-name alias of getter `ts`
     * @see {@link OhDay.ts}
     */
    getTimeStamp: () => number
    /**
     * @description Full-name alias of getter `dd`
     * @see {@link OhDay.dd}
     */
    getDateObject: () => Date
    /**
     * @description Full-name alias of getter `year`
     * @see {@link OhDay.year}
     */
    getYear: () => number
    /**
     * @description Full-name alias of getter `month`
     * @see {@link OhDay.month}
     */
    getMonth: () => number
    /**
     * @description Full-name alias of getter `date`
     * @see {@link OhDay.date}
     */
    getDate: () => number
    /**
     * @description Full-name alias of getter `hour`
     * @see {@link OhDay.hour}
     */
    getHour: () => number
    /**
     * @description Full-name alias of getter `minute`
     * @see {@link OhDay.minute}
     */
    getMinute: () => number
    /**
     * @description Full-name alias of getter `second`
     * @see {@link OhDay.second}
     */
    getSecond: () => number
    /**
     * @description Full-name alias of getter `ms`
     * @see {@link OhDay.ms}
     */
    getMS: () => number
    /**
     * @description Full-name alias of getter `ms`
     * @see {@link OhDay.ms}
     */
    getMilliseconds: () => number
    /**
     * @description Full-name alias of getter `od`
     * @see {@link OhDay.od}
     */
    clone: () => OhDay
    // endregion

    // region Output
    /**
     * @description Full-name alias of `p()`
     * @see {@link OhDay.p}
     */
    format: OhDay["p"]
    /**
     * @description Full-name alias of `p()`
     * @see {@link OhDay.p}
     */
    print: OhDay["p"]
    /**
     * @description Full-name alias of `p()`
     * @see {@link OhDay.p}
     */
    toString: OhDay["p"]
    /**
     * @description Full-name alias of `pa()`
     * @see {@link OhDay.pa}
     */
    printArray: OhDay["pa"]
    /**
     * @description Full-name alias of `pa()`
     * @see {@link OhDay.pa}
     */
    toArray: OhDay["pa"]
    /**
     * @description Full-name alias of `po()`
     * @see {@link OhDay.po}
     */
    printObject: OhDay["po"]
    /**
     * @description Full-name alias of `po()`
     * @see {@link OhDay.po}
     */
    toObject: OhDay["po"]
    /**
     * @description Full-name alias of `pd()`
     * @see {@link OhDay.pd}
     */
    printDate: OhDay["pd"]
    /**
     * @description Full-name alias of `pd()`
     * @see {@link OhDay.pd}
     */
    toDate: OhDay["pd"]
    /**
     * @description Full-name alias of `pd()`
     * @see {@link OhDay.pd}
     */
    toDateObject: OhDay["pd"]
    // endregion

    // region Manipulation
    /**
     * @description Full-name alias of `c()`
     * @see {@link OhDay.c}
     */
    set: OhDay["c"]
    /**
     * @description Full-name alias of `c()`
     * @see {@link OhDay.c}
     */
    change: OhDay["c"]
    /**
     * @description Full-name alias of `cs()`
     * @see {@link OhDay.cs}
     */
    startOf: OhDay["cs"]
    /**
     * @description Full-name alias of `cs()`
     * @see {@link OhDay.cs}
     */
    changeToStart: OhDay["cs"]
    /**
     * @description Full-name alias of `ce()`
     * @see {@link OhDay.ce}
     */
    endOf: OhDay["ce"]
    /**
     * @description Full-name alias of `ce()`
     * @see {@link OhDay.ce}
     */
    changeToEnd: OhDay["ce"]
    /**
     * @description Full-name alias of `g()`
     * @see {@link OhDay.g}
     */
    get: OhDay["g"]
    /**
     * @description Full-name alias of `sub()`
     * @see {@link OhDay.sub}
     */
    subtract: OhDay["sub"]
    /**
     * @description Full-name alias of `len()`
     * @see {@link OhDay.len}
     */
    lengthOf: OhDay["len"]
    /**
     * @description Full-name alias of `len()`
     * @see {@link OhDay.len}
     */
    getLength: OhDay["len"]
    // endregion

    // region Comparison
    /**
     * @description Full-name alias of `eq()`
     * @see {@link OhDay.eq}
     */
    isSame: OhDay["eq"]
    /**
     * @description Full-name alias of `eq()`
     * @see {@link OhDay.eq}
     */
    isEqual: OhDay["eq"]
    /**
     * @description Full-name alias of `lt()`
     * @see {@link OhDay.lt}
     */
    isBefore: OhDay["lt"]
    /**
     * @description Full-name alias of `lt()`
     * @see {@link OhDay.lt}
     */
    isLessThan: OhDay["lt"]
    /**
     * @description Full-name alias of `gt()`
     * @see {@link OhDay.gt}
     */
    isAfter: OhDay["gt"]
    /**
     * @description Full-name alias of `gt()`
     * @see {@link OhDay.gt}
     */
    isGreaterThan: OhDay["gt"]
    /**
     * @description Full-name alias of `le()`
     * @see {@link OhDay.le}
     */
    isSameOrBefore: OhDay["le"]
    /**
     * @description Full-name alias of `le()`
     * @see {@link OhDay.le}
     */
    isBeforeOrSame: OhDay["le"]
    /**
     * @description Full-name alias of `le()`
     * @see {@link OhDay.le}
     */
    isLessOrEqual: OhDay["le"]
    /**
     * @description Full-name alias of `ge()`
     * @see {@link OhDay.ge}
     */
    isSameOrAfter: OhDay["ge"]
    /**
     * @description Full-name alias of `ge()`
     * @see {@link OhDay.ge}
     */
    isAfterOrSame: OhDay["ge"]
    /**
     * @description Full-name alias of `ge()`
     * @see {@link OhDay.ge}
     */
    isGreaterOrEqual: OhDay["ge"]
    /**
     * @description Full-name alias of `bt()`
     * @see {@link OhDay.bt}
     */
    isBetween: OhDay["bt"]
    // endregion
  }
}

export const fullname: OhDayPlugin = (instance) => {
  /* eslint-disable style/max-statements-per-line */
  instance.prototype.getString = function () { return this.s }
  instance.prototype.getISOString = function () { return this.iso }
  instance.prototype.getTime = function () { return this.ts }
  instance.prototype.getTimeStamp = function () { return this.ts }
  instance.prototype.getDateObject = function () { return this.dd }
  instance.prototype.getYear = function () { return this.year }
  instance.prototype.getMonth = function () { return this.month }
  instance.prototype.getDate = function () { return this.date }
  instance.prototype.getHour = function () { return this.hour }
  instance.prototype.getMinute = function () { return this.minute }
  instance.prototype.getSecond = function () { return this.second }
  instance.prototype.getMS = function () { return this.ms }
  instance.prototype.getMilliseconds = function () { return this.ms }
  instance.prototype.clone = function () { return this.od }
  /* eslint-enable style/max-statements-per-line */

  instance.prototype.format = instance.prototype.p
  instance.prototype.print = instance.prototype.p
  instance.prototype.toString = instance.prototype.p
  instance.prototype.printArray = instance.prototype.pa
  instance.prototype.toArray = instance.prototype.pa
  instance.prototype.printObject = instance.prototype.po
  instance.prototype.toObject = instance.prototype.po
  instance.prototype.printDate = instance.prototype.pd
  instance.prototype.toDate = instance.prototype.pd
  instance.prototype.toDateObject = instance.prototype.pd

  instance.prototype.set = instance.prototype.c
  instance.prototype.change = instance.prototype.c
  instance.prototype.startOf = instance.prototype.cs
  instance.prototype.changeToStart = instance.prototype.cs
  instance.prototype.endOf = instance.prototype.ce
  instance.prototype.changeToEnd = instance.prototype.ce
  instance.prototype.get = instance.prototype.g
  instance.prototype.subtract = instance.prototype.sub
  instance.prototype.lengthOf = instance.prototype.len
  instance.prototype.getLength = instance.prototype.len

  instance.prototype.isSame = instance.prototype.eq
  instance.prototype.isEqual = instance.prototype.eq
  instance.prototype.isBefore = instance.prototype.lt
  instance.prototype.isLessThan = instance.prototype.lt
  instance.prototype.isAfter = instance.prototype.gt
  instance.prototype.isGreaterThan = instance.prototype.gt
  instance.prototype.isSameOrBefore = instance.prototype.le
  instance.prototype.isBeforeOrSame = instance.prototype.le
  instance.prototype.isLessOrEqual = instance.prototype.le
  instance.prototype.isSameOrAfter = instance.prototype.ge
  instance.prototype.isAfterOrSame = instance.prototype.ge
  instance.prototype.isGreaterOrEqual = instance.prototype.ge
  instance.prototype.isBetween = instance.prototype.bt
}
