const errorCode = require('../../constants/errorCode')
const pool = require('../../db')
require('../../utils')()
const query = require('../../db/query')

module.exports = function addContextApi(app) {
  app.post('/v1/context/end', async (req, res) => {
    let body = req.body

    try {
      if (!body) throw errorCode.WRONG_API

      const { contextID, playerID, score } = body
      if (!contextID || !playerID || !score || !parseInt(score))
        throw errorCode.WRONG_API

      const listField = ['score', 'update_time']
      const listValue = [parseInt(score), Date.now() / 1000]
      const condition = formatString(
        "context_id='{0}' and player_id='{1}'",
        contextID,
        playerID
      )
      const updateQuery = query.update('match', listField, listValue, condition)

      try {
        const client = await pool.connect()
        await client.query(updateQuery)

        res.json(formatResponse(errorCode.SUCCESS))
        client.release()
      } catch (error) {
        console.error(error)
        throw errorCode.DB_ERROR
      }
    } catch (error) {
      console.error(error)
      if (errorCode.hasOwnProperty(error)) res.json(formatResponse(error))
      else res.json(formatResponse(errorCode.UNKNOWN))
    }
  })
}
