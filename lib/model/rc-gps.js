'use strict'

const DJIBuffer = require('../djibuffer')

class RCGPS extends DJIBuffer {
  getLatitude () {
    return this.readInt(7, 4)
  }

  getLongitude () {
    return this.readInt(11, 4)
  }

  getXSpeed () {
    return this.readInt(15, 4) / 1000
  }

  getYSpeed () {
    return this.readInt(19, 4) / 1000
  }

  getGpsNum () {
    return this.readShort(23, 1)
  }

  getGpsStatus () {
    return this.readShort(28, 2) === 1
  }
}

module.exports = RCGPS
