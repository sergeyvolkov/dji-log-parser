'use strict'

const DJIBuffer = require('../djibuffer')

class Custom extends DJIBuffer {
  getDistance () {
    return this.readFloat(6, 4)
  }

  getHSpeed () {
    return this.readFloat(2, 4)
  }

  getDateTime () {
    return new Date(parseInt(this.readLong(10, 8).toString())).toISOString()
  }
}

module.exports = Custom
