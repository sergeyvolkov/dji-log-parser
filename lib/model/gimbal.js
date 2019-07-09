'use strict'

const DJIBuffer = require('../djibuffer')

const MODE = {
  0: 'YawNoFollow',
  1: 'FPV',
  2: 'YawFollow',
  100: 'OTHER'
}

class Gimbal extends DJIBuffer {
  getPitch () {
    return this.readShort(0, 2)
  }

  getRoll () {
    return this.readShort(2, 2)
  }

  getYaw () {
    return this.readShort(4, 2)
  }

  getRollAdjust () {
    return this.readShort(7, 1)
  }

  getYawAngle () {
    return this.readShort(8, 2)
  }

  getJoystickVerDirection () {
    return this.readInt(8, 1) & 3
  }

  getJoystickHorDirection () {
    return (this.readInt(8, 1) >> 2) & 3
  }

  isAutoCalibration () {
    return (this.readInt(10, 1) & 8) !== 0
  }

  autoCalibrationResult () {
    return (this.readInt(10, 1) & 16) !== 0
  }

  isPitchInLimit () {
    return (this.readInt(10, 1) & 1) !== 0
  }

  isRollInLimit () {
    return (this.readInt(10, 1) & 2) !== 0
  }

  isYawInLimit () {
    return (this.readInt(10, 1) & 4) !== 0
  }

  isStuck () {
    return (this.readInt(10, 1) & 64) !== 0
  }

  getMode () {
    return MODE[this.readInt(6, 1) >>> 6]
  }

  getSubMode () {
    return (this.readInt(6, 1) >> 5) & 1
  }

  getVersion () {
    return this.readShort(11, 1) & 15
  }

  isDoubleClick () {
    return (this.readShort(11, 1) & 32) !== 0
  }

  isTripleClick () {
    return (this.readShort(11, 1) & 64) !== 0
  }

  isSingleClick () {
    return (this.readShort(11, 1) & 128) !== 0
  }
}

module.exports = Gimbal
