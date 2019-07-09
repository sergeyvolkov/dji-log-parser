'use strict'

const DJIBuffer = require('../djibuffer')

const DJI_BATTERY_STATUS = {
  0: 'UserBatteryReqGoHome',
  1: 'UserBatteryReqLand',
  4: 'SmartBatteryReqGoHome',
  8: 'SmartBatteryReqLand',
  16: 'MainVoltageLowGoHOme',
  32: 'MainVoltageLowLand',
  64: 'BatteryCellError',
  128: 'BatteryCommunicateError',
  256: 'VoltageLowNeedLand',
  512: 'BatteryTempVoltageLow',
  1024: 'BatteryNotReady',
  2048: 'BatteryFirstChargeNotFull',
  69905: 'OTHER'
}

class SmartBattery extends DJIBuffer {
  getUsefulTime () {
    return this.readInt(0, 2)
  }

  getGoHomeTime () {
    return this.readInt(2, 2)
  }

  getLandTime () {
    return this.readInt(4, 2)
  }

  getGoHomeBattery () {
    return this.readInt(6, 2)
  }

  getLandBattery () {
    return this.readInt(8, 2)
  }

  getSafeFlyRadius () {
    return this.readFloat(10, 4)
  }

  getVolumeConsume () {
    return this.readFloat(14, 4)
  }

  getStatus () {
    return DJI_BATTERY_STATUS[this.readInt(18, 4)]
  }

  getGoHomeStatus () {
    return this.readInt(22, 1)
  }

  getGoHomeCountDown () {
    return this.readInt(23, 1)
  }

  getVoltage () {
    return this.readInt(24, 2)
  }

  getLowWarning () {
    return this.readInt(27, 1) & 127
  }

  getLowWarningGoHome () {
    return (this.readInt(27, 1) & 128) != 0
  }

  getSeriousLowWarning () {
    return this.readInt(28, 1) & 127
  }

  getSeriousLowWarningLanding () {
    return (this.readInt(28, 1) & 128) != 0
  }

  getVoltagePercent () {
    return this.readInt(29, 1)
  }
}

module.exports = SmartBattery
