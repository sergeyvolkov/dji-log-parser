'use strict'

const DJIBuffer = require('../djibuffer')

const APP_TYPE = {
  0: 'UNKNOWN',
  1: 'IOS',
  2: 'ANDROID'
}

class Details extends DJIBuffer {
  getSubStreet () {
    return this.buffer.toString('utf8', this.index, this.index + 20)
  }

  getStreet () {
    return this.buffer.toString('utf8', this.index + 20, this.index + 40)
  }

  getCity () {
    return this.buffer.toString('utf8', this.index + 40, this.index + 60)
  }

  getArea () {
    return this.buffer.toString('utf8', this.index + 60, this.index + 80)
  }

  isFavorite () {
    return (this.readInt(80, 1) & 1) !== 0
  }

  isNew () {
    return (this.readInt(81, 1) & 1) !== 0
  }

  needsUpload () {
    return (this.readInt(82, 1) & 1) !== 0
  }

  getRecordLineCount () {
    return this.readInt(83, 4)
  }

  getUpdateTime () {
    return new Date(parseInt(this.readLong(91, 8).toString())).toISOString()
  }

  getLongitude () {
    return this.readDouble(99, 8)
  }

  getLatitude () {
    return this.readDouble(107, 8)
  }

  getTotalDistance () {
    return this.readFloat(115, 4)
  }

  getTotalTime () {
    return this.readInt(119, 4)
  }

  getMaxHeight () {
    return this.readFloat(123, 4)
  }

  getMaxHSpeed () {
    return this.readFloat(127, 4)
  }

  getMaxVSpeed () {
    return this.readFloat(131, 4)
  }

  getPhotoNum () {
    return this.readInt(135, 4)
  }

  getVideoTime () {
    return this.readInt(139, 4)
  }

  getAircraftSn () {
    return this.buffer.toString('utf8', this.index + 267, this.index + 277)
  }

  getAircraftName () {
    return this.buffer.toString('utf8', this.index + 278, this.index + 302)
  }

  getActiveTimestamp () {
    return new Date(parseInt(this.readLong(310, 8).toString())).toISOString()
  }

  getCameraSn () {
    return this.buffer.toString('utf8', this.index + 318, this.index + 328)
  }

  getRcSn () {
    return this.buffer.toString('utf8', this.index + 328, this.index + 338)
  }

  getBatterySn () {
    return this.buffer.toString('utf8', this.index + 338, this.index + 348)
  }

  getAppType () {
    return APP_TYPE[this.readInt(348, 1)]
  }

  getAppVersion () {
    return [
      this.readInt(349, 1),
      this.readInt(350, 1),
      this.readInt(351, 1)
    ].join('.')
  }
}

module.exports = Details
