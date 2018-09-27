const errorCode = require('../constants/errorCode')

module.exports = function() {
  this.formatResponse = (status, data, code, msg) => {
    return {
      code: code ? code : errorCode.CODE_NUMBER[status],
      msg: msg ? msg : errorCode.MESSAGE_CODE[status],
      data
    }
  }
}
