'use strict'

const DJIBuffer = require('../djibuffer')

const DRONE_TYPE = {
  0: 'Unknown',
  1: 'Inspire',
  2: 'P3S',
  3: 'P3X',
  4: 'P3C',
  5: 'OpenFrame',
  7: 'P4',
  13: 'Mavic',
  100: 'None'
}

const APP_TYPE = {
  0: 'UNKNOWN',
  1: 'IOS',
  2: 'ANDROID'
}

class Recover extends DJIBuffer {
  getDroneType () {
    return DRONE_TYPE[this.readInt(0, 1)]
  }

  getAppType () {
    return APP_TYPE[this.readInt(1, 1)]
  }

  getAppVersion () {
    return this.readInt(2, 1) + '.' + this.readInt(3, 1) + '.' + this.readInt(4, 1)
  }

  getAircraftSn () {
    return this.readString(5, 10)
  }

  getAircraftName () {
    return this.readString(15, 24)
  }

  getActiveTimestamp () {
    return new Date(parseInt(this.readLong(47, 8).toString())).toISOString()
  }

  getCameraSn () {
    return this.readString(55, 10)
  }

  getRcSn () {
    return this.readString(65, 10)
  }

  getBatterySn () {
    return this.readString(75, 85)
  }
}

module.exports = Recover
