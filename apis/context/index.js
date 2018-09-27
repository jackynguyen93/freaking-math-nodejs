const errorCode = require('../../constants/errorCode')
const pool = require('../../db')

module.exports = function addContextApi(app) {
  app.post('/v1/context/end', async (req, res) => {
    let body = req.body

    try {
      if (!body) throw errorCode.WRONG_API

      try {
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM Player')

        res.json(formatResponse(errorCode.SUCCESS, result))
      } catch (error) {
        console.error(error)
        throw errorCode.DB_ERROR
      }

      // const results = {
      //   results: result ? result.rows : null
      // }
      // res.json(results)
      // client.release()
    } catch (error) {
      console.error(error)
      if (errorCode.hasOwnProperty(error)) res.json(formatResponse(error))
      else res.json(formatResponse(errorCode.UNKNOWN))
    }
  })
}
