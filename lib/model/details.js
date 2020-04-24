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

  getTimestamp () {
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
    return this.readInt(119, 4) / 100
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

  getAircraftName () {
    return this.buffer.toString('utf8', this.index + 280, this.index + 312)
  }

  getAircraftSn () {
    return this.buffer.toString('utf8', this.index + 312, this.index + 328)
  }

  getCameraSn () {
    return this.buffer.toString('utf8', this.index + 328, this.index + 344)
  }

  getRcSn () {
    return this.buffer.toString('utf8', this.index + 344, this.index + 360)
  }

  getBatterySn () {
    return this.buffer.toString('utf8', this.index + 360, this.index + 376)
  }

  getAppType () {
    return APP_TYPE[this.readInt(376, 1)] || APP_TYPE[0]
  }

  getAppVersion () {
    return [
      this.readInt(377, 1),
      this.readInt(378, 1),
      this.readInt(379, 1)
    ].join('.')
  }
}

module.exports = Details
