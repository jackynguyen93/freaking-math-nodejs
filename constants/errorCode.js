const CODE_NUMBER = {
  SUCCESS: '200',
  WRONG_API: '2100',
  DB_ERROR: '2101',
  UNKNOWN: '2102'
}

const MESSAGE_CODE = {
  SUCCESS: 'OK',
  WRONG_API: 'wrong format api',
  DB_ERROR: 'cannot connect to db',
  UNKNOWN: 'no message'
}

const ERROR_CODE = {
  SUCCESS: 'SUCCESS',
  WRONG_API: 'WRONG_API',
  DB_ERROR: 'DB_ERROR',
  UNKNOWN: 'UNKNOWN',
  CODE_NUMBER,
  MESSAGE_CODE
}

module.exports = ERROR_CODE
