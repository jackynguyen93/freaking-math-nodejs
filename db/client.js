const pool = require('./pool')

module.exports = class Client {
  async connect() {
    this.client = await pool.connect()
  }

  async transactionQuery(listQuery) {
    const client = this.client

    try {
      await client.query('BEGIN')

      let result
      for (let index = 0; index < listQuery.length; index++) {
        const query = listQuery[index]
        result = await client.query(query)
      }

      await client.query('COMMIT')

      return result
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    }
  }

  async query(query) {
    const result = await this.client.query(query)
    return result
  }

  release() {
    this.client.release()
  }
}
