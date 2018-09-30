const Client = require('./client')
const client = new Client()
const pool = require('./pool')
const query = require('./query')

module.exports = {
  client,
  pool,
  query
}
