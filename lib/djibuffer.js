'use strict'

const ByteBuffer = require('bytebuffer')
const tmpBuffer = new ByteBuffer(32, true)

class DJIBuffer {
  constructor (buffer, index, key) {
    this.buffer = buffer
    this.index = index
    this.key = key || [0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0]
  }

  clearCopyAndDecode (offset, length) {
    tmpBuffer.fill(0, 0, tmpBuffer.length)
    this.buffer.copyTo(tmpBuffer, 0, this.index + offset, this.index + offset + length)

    for (let i = 0; i < length; i++) {
      const decodedByte = tmpBuffer.readUint8(i) ^ this.key[(offset + i) % 8]
      tmpBuffer.writeUint8(decodedByte, i)
    }

    return tmpBuffer
  }

  readDouble (offset, length) {
    return this
      .clearCopyAndDecode(offset, length)
      .readDouble(0)
  }

  readFloat (offset, length) {
    return this
      .clearCopyAndDecode(offset, length)
      .readFloat(0)
  }

  readByte (offset) {
    return this
      .clearCopyAndDecode(offset, 1)
      .readUint8(0)
  }

  readInt (offset, length) {
    return this
      .clearCopyAndDecode(offset, length)
      .readInt32(0)
  }

  readShort (offset, length) {
    return this
      .clearCopyAndDecode(offset, length)
      .readInt16(0)
  }

  readLong (offset, length) {
    return this
      .clearCopyAndDecode(offset, length)
      .readLong(0)
  }

  readString (offset, length) {
    return this
      .clearCopyAndDecode(offset, length)
      .toString('utf8', 0, length)
  }

  length () {
    return this.buffer.length
  }
}

module.exports = DJIBuffer
