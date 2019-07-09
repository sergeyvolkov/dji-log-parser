'use strict'

const DJIBuffer = require('../djibuffer')

const DEFORM_MODE = {
  0: 'PACK',
  1: 'PROTECT',
  2: 'NORMAL',
  3: 'OTHER'
}

const TRIPOD_STATUS = {
  0: 'UNKNOWN',
  1: 'FOLD_COMPLETE',
  2: 'FOLDING',
  3: 'STRETCH_COMPLETE',
  4: 'STRETCHING',
  5: 'STOP_DEFORMATION'
}

class Deform extends DJIBuffer {
  getDeformMode () {
    return DEFORM_MODE[(this.readInt(0, 1) & 48) >>> 4]
  }

  getDeformStatus () {
    return TRIPOD_STATUS[(this.readInt(0, 1) & 14) >>> 1]
  }

  isDeformProtected () {
    return (this.readInt(0, 1) & 1) != 0
  }
}

module.exports = Deform
