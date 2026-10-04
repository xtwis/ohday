import type { OhDayPlugin } from "@xtwis/ohday"

/**
 * @description Long-name aliases for every short method on `OhDay`. See the docs site for the full alias map.
 * @see https://x.twis.uk/en/ohday/plugin/fullname.html
 */
declare module "@xtwis/ohday" {
  interface OhDay {
    // region Information (getter aliases)
    getString: () => string
    getISOString: () => string
    getTime: () => number
    getTimeStamp: () => number
    getDateObject: () => Date
    getYear: () => number
    getMonth: () => number
    getDate: () => number
    getHour: () => number
    getMinute: () => number
    getSecond: () => number
    getMS: () => number
    getMilliseconds: () => number
    clone: () => OhDay
    // endregion

    // region Output
    format: OhDay["p"]
    print: OhDay["p"]
    toString: OhDay["p"]
    printArray: OhDay["pa"]
    toArray: OhDay["pa"]
    printObject: OhDay["po"]
    toObject: OhDay["po"]
    printDate: OhDay["pd"]
    toDate: OhDay["pd"]
    toDateObject: OhDay["pd"]
    // endregion

    // region Manipulation
    set: OhDay["c"]
    change: OhDay["c"]
    startOf: OhDay["cs"]
    changeToStart: OhDay["cs"]
    endOf: OhDay["ce"]
    changeToEnd: OhDay["ce"]
    get: OhDay["g"]
    subtract: OhDay["sub"]
    lengthOf: OhDay["len"]
    getLength: OhDay["len"]
    // endregion

    // region Comparison
    isSame: OhDay["eq"]
    isEqual: OhDay["eq"]
    isBefore: OhDay["lt"]
    isLessThan: OhDay["lt"]
    isAfter: OhDay["gt"]
    isGreaterThan: OhDay["gt"]
    isSameOrBefore: OhDay["le"]
    isBeforeOrSame: OhDay["le"]
    isLessOrEqual: OhDay["le"]
    isSameOrAfter: OhDay["ge"]
    isAfterOrSame: OhDay["ge"]
    isGreaterOrEqual: OhDay["ge"]
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
