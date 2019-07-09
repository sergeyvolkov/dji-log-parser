'use strict'

const DJIBuffer = require('../djibuffer')

class AppMessage extends DJIBuffer {
  constructor (buffer, index, length, key) {
    super(buffer, index, key)

    this.length = length
  }

  getMessage () {
    return this.readString(0, this.length)
  }
}

module.exports = AppMessage
