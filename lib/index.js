'use strict'

const { EventEmitter } = require('events')
const ByteBuffer = require('bytebuffer')

const OSD = require('./model/osd')
const RC = require('./model/rc')
const RCGPS = require('./model/rc-gps')
const Deform = require('./model/deform')
const Gimbal = require('./model/gimbal')
const AppMessage = require('./model/app-message')
const SmartBattery = require('./model/smart-battery')
const CenterBattery = require('./model/center-battery')
const Custom = require('./model/custom')
const Home = require('./model/home')
const Recover = require('./model/recover')
const Details = require('./model/details')
const AppGPS = require('./model/app-gps')

const keys = require('./keys')

const types = {
  1: 'OSD',
  2: 'HOME',
  3: 'GIMBAL',
  4: 'RC',
  5: 'CUSTOM',
  6: 'DEFORM',
  7: 'CENTER_BATTERY',
  8: 'SMART_BATTERY',
  9: 'APP_TIP',
  10: 'APP_WARN',
  11: 'RC_GPS',
  12: 'RC_DEBUG',
  13: 'RECOVER',
  14: 'APP_GPS',
  15: 'FIRMWARE',
  16: 'OFDM_DEBUG',
  17: 'VISION_GROUP',
  18: 'VISION_WARN',
  19: 'MC_PARAM',
  20: 'APP_OPERATION',
  255: 'END',
  254: 'OTHER'
}

class DJIParser extends EventEmitter {
  static isFrame (buffer, offset) {
    const tId = buffer.readUint8(offset++)
    const length = buffer.readUint8(offset++)
    if (offset + length > buffer.limit - 1) {
      return false
    }

    const end = buffer.readUint8(offset + length)
    return tId != 0 && end == 0xFF
  }

  static isImage (buffer, offset) {
    const header = buffer.readUInt32(offset)
    return header == 3774863615 // JFIF header 0xFF 0xD8 0xFF 0xE0
  }

  constructor () {
    super()
    this.lastMessages = {}
  }

  getLast (type) {
    return this.lastMessages[type]
  }

  parse (inputBuffer) {
    // reset messages
    this.lastMessages = {}

    // wrap buffer
    const buffer = ByteBuffer.wrap(inputBuffer, 'binary', true)

    // first 3 header bytes show address, where Details section starts
    const detailsOffset = buffer.readInt(0, 3)

    // guess if frames are encrypted
    const isEncrypted = buffer.readUint8(10) > 6

    // packets start at offset 12
    let offset = 12

    // parse records are located before Details section
    while (offset < (detailsOffset || buffer.limit - 4)) {
      if (DJIParser.isFrame(buffer, offset)) {
        offset = this.extractFrame(buffer, offset, isEncrypted)
        continue
      }

      if (DJIParser.isImage(buffer, offset)) {
        offset = this.extractImage(buffer, offset)
        continue
      }
      offset++
    }

    // parse Details
    if (detailsOffset > 0) {
      this.emit('DETAILS', new Details(buffer, detailsOffset))
    }
  }

  extractFrame (buffer, offset, isEncrypted) {
    // first byte of a packet is 'type'
    const tId = buffer.readUint8(offset++)
    const type = types[tId]

    // second byte is packet length
    const length = buffer.readUint8(offset++)

    let key
    let dataOffset = offset
    let dataLength = length

    // Get key if frame is encrypted
    if (isEncrypted) {
      const byteKey = buffer.readUint8(offset)
      key = keys[((tId - 1) * 256) + byteKey]
      dataOffset++
      dataLength -= 2
    }

    let data = null

    switch (type) {
      case 'OSD':
        data = new OSD(buffer, dataOffset, key)
        break
      case 'DEFORM':
        data = new Deform(buffer, dataOffset, key)
        break
      case 'SMART_BATTERY':
        data = new SmartBattery(buffer, dataOffset, key)
        break
      case 'GIMBAL':
        data = new Gimbal(buffer, dataOffset, key)
        break
      case 'RC':
        data = new RC(buffer, dataOffset, key)
        break
      case 'CUSTOM':
        data = new Custom(buffer, dataOffset, key)
        break
      case 'RC_GPS':
        data = new RCGPS(buffer, dataOffset, key)
        break
      case 'CENTER_BATTERY':
        data = new CenterBattery(buffer, dataOffset, key)
        break
      case 'HOME':
        data = new Home(buffer, dataOffset, key)
        break
      case 'RECOVER':
        data = new Recover(buffer, dataOffset, key)
        break
      case 'APP_TIP':
      case 'APP_WARN':
        data = new AppMessage(buffer, dataOffset, dataLength, key)
        break
      case 'APP_GPS':
        data = new AppGPS(buffer, dataOffset, key)
        break
    }

    if (data !== null) {
      this.emit(type, data)
      this.lastMessages[type] = data
    }

    return offset + length + 1
  }

  extractImage (buffer, offset) {
    let endOffset

    for (endOffset = offset; endOffset < buffer.limit; endOffset++) {
      if (buffer.readUint16(endOffset) == 55807) { // End JFIF marker 0xFF 0xD9
        this.emit('IMAGE', buffer.copy(offset, endOffset + 2))
        break
      }
    }
    return endOffset + 2
  }
}

module.exports = DJIParser
