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

  this.underscoreToCamel = myString => {
    var camelCased = myString.replace(/_([a-z])/g, function(g) {
      return g[1].toUpperCase()
    })

    return camelCased
  }

  this.parseData = data => {
    let parseData = {}
    const listDataKeys = Object.keys(data)

    listDataKeys.forEach(key => {
      const newKey = this.underscoreToCamel(key)
      parseData[newKey] = data[key]
    })

    return parseData
  }
}
