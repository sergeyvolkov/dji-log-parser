'use strict'

const DJIBuffer = require('../djibuffer')

class AppGPS extends DJIBuffer {
  getLongitude () {
    return this.readDouble(0, 8)
  }

  getLatitude () {
    return this.readDouble(8, 8)
  }

  getAccuracy () {
    return this.readFloat(16, 4)
  }
}

module.exports = AppGPS
