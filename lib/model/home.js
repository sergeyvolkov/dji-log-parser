'use strict'

const DJIBuffer = require('../djibuffer')

const GOHOME_STATUS = {
  0: 'STANDBY',
  1: 'PREASCENDING',
  2: 'ALIGN',
  3: 'ASCENDING',
  4: 'CRUISE',
  7: 'OTHER'
}

const IOC_MODE = {
  1: 'CourseLock',
  2: 'HomeLock',
  3: 'HotspotSurround',
  100: 'OTHER'
}

const MOTOR_ESCM_STATE = {
  0: 'NON_SMART',
  1: 'DISCONNECT',
  2: 'SIGNAL_ERROR',
  3: 'RESISTANCE_ERROR',
  4: 'BLOCK',
  5: 'NON_BALANCE',
  6: 'ESCM_ERROR',
  7: 'PROPELLER_OFF',
  8: 'MOTOR_IDLE',
  9: 'MOTOR_UP',
  10: 'MOTOR_OFF',
  11: 'NON_CONNECT',
  100: 'OTHER'
}

class Home extends DJIBuffer {
  getLongitude () {
    return this.readDouble(0, 8) * 180 / Math.PI
  }

  getLatitude () {
    return this.readDouble(8, 8) * 180 / Math.PI
  }

  getHeight () {
    return this.readFloat(16, 4)
  }

  getIOCMode () {
    return IOC_MODE[(this.readInt(20, 2) & 57344) >>> 13]
  }

  isIOCEnabled () {
    return ((this.readInt(20, 2) & 4096) >>> 12) !== 0
  }

  isBeginnerMode () {
    return (this.readInt(20, 2) >> 11 & 1) !== 0
  }

  isCompassCeleing () {
    return ((this.readInt(20, 2) & 1024) >>> 10) !== 0
  }

  getCompassCeleStatus () {
    return (this.readInt(20, 2) & 768) >>> 8
  }

  hasGoHome () {
    return ((this.readInt(20, 2) & 128) >>> 7) !== 0
  }

  getGoHomeStatus () {
    return GOHOME_STATUS[(this.readInt(20, 2) & 112) >>> 4]
  }

  isReachLimitHeight () {
    return ((this.readInt(20, 2) & 32) >>> 5) !== 0
  }

  isReachLimitDistance () {
    return ((this.readInt(20, 2) & 16) >>> 4) !== 0
  }

  isDynamicHomePointEnabled () {
    return ((this.readInt(20, 2) & 8) >>> 3) !== 0
  }

  getAircraftHeadDirection () {
    return (this.readInt(20, 2) & 4) >>> 2
  }

  getGoHomeMode () {
    return (this.readInt(20, 2) & 2) >>> 1
  }

  isHomeRecord () {
    return (this.readInt(20, 2) & 1) !== 0
  }

  getGoHomeHeight () {
    return this.readInt(22, 2)
  }

  getCourseLockAngle () {
    return this.readShort(24, 2)
  }

  getDataRecorderStatus () {
    return this.readInt(26, 1)
  }

  getDataRecorderRemainCapacity () {
    return this.readInt(27, 1)
  }

  getDataRecorderRemainTime () {
    return this.readInt(28, 2)
  }

  getCurDataRecorderFileIndex () {
    return this.readInt(30, 2)
  }

  isFlycInSimulationMode () {
    return (this.readInt(32, 1) & 1) !== 0
  }

  isFlycInNavigationMode () {
    return ((this.readInt(32, 1) & 2) >>> 1) !== 0
  }

  isWingBroken () {
    return (this.readInt(32, 1) & 4096) !== 0
  }

  getMotorEscmState () {
    const state = []
    const value = this.readInt(32, 1)
    for (let i = 0; i < 8; i++) {
      state.push(MOTOR_ESCM_STATE[(value >> (i * 4)) & 15])
    }
    return state
  }

  getForceLandingHeight () {
    return this.readInt(45, 1)
  }
}

module.exports = Home
