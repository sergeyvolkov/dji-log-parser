'use strict'

const DJIBuffer = require('../djibuffer')

class RC extends DJIBuffer {
  getAileron () {
    return this.readInt(0, 2)
  }

  getElevator () {
    return this.readInt(2, 2)
  }

  getThrottle () {
    return this.readInt(4, 2)
  }

  getRudder () {
    return this.readInt(6, 2)
  }

  getGyroValue () {
    return this.readInt(8, 2)
  }

  getGoHome () {
    return this.readInt(11, 1) >> 3 & 1
  }

  getCoronaChange () {
    return (this.readInt(10, 1) >> 7 & 1) == 1
  }

  getChangeDirection () {
    return this.readInt(10, 1) >> 6 & 1
  }

  getOffset () {
    return this.readInt(10, 1) >> 1 & 31
  }

  getIsPushCorona () {
    return this.readInt(10, 1) & 1
  }

  getRecordStatus () {
    return (this.readInt(12, 1) >> 7 & 1) == 1
  }

  getShutterStatus () {
    return (this.readInt(12, 1) >> 6 & 1) == 1
  }

  getPlayback () {
    return this.readInt(12, 1) >> 5 & 1
  }

  getCustom2 () {
    return this.readInt(12, 1) >> 3 & 1
  }

  getCustom1 () {
    return this.readInt(12, 1) >> 4 & 1
  }

  isGoHomeButtonPressed () {
    return ((this.readInt(11, 1) >> 3) & 1) != 0
  }

  getFootStool () {
    return ((this.readInt(11, 1) >> 6) & 3) == 3
  }

  getMode () {
    return (this.readInt(11, 1) >> 4) & 3
  }

  getBandWidth () {
    return this.readInt(13, 1)
  }
}

module.exports = RC
