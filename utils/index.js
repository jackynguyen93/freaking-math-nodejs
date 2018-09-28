const errorCode = require('../constants/errorCode')

module.exports = function() {
  this.formatResponse = (status, data, code, msg) => {
    return {
      code: code ? code : errorCode.CODE_NUMBER[status],
      msg: msg ? msg : errorCode.MESSAGE_CODE[status],
      data
    }
  }

  this.formatString = (str, ...values) => {
    var formatted = str
    for (var i = 0; i < values.length; i++) {
      var regexp = new RegExp('\\{' + i + '\\}', 'gi')
      formatted = formatted.replace(regexp, values[i])
    }
    return formatted
  }
}
