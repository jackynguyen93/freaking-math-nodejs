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
      const values = query.joinFieldValue(listField, listValue)

      const listFieldCondition = ['context_id', 'player_id']
      const listValueCondition = [contextID, playerID]
      const condition = query.joinFieldValue(
        listFieldCondition,
        listValueCondition,
        ' and '
      )

      const updateQuery = query.update('match', values, condition)

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

  app.get('/v1/context/opponent/info', async (req, res) => {
    let params = req.query

    try {
      if (!params) throw errorCode.WRONG_API

      const { contextID, playerID } = params
      if (!contextID || !playerID) throw errorCode.WRONG_API

      const listField = [
        'm.context_id',
        'm.player_id',
        'm.score',
        'm.is_ready',
        'p.player_name',
        'p.avatar',
        'p.best_score'
      ]
      const field = listField.join(', ')
      const table = query.innerJoin(
        'match as m',
        'player as p',
        'm.player_id = p.player_id'
      )
      const condition = formatString(
        "{0} and m.player_id<>'{1}'",
        query.joinFieldValue(['m.context_id'], [contextID], ' and '),
        playerID
      )

      const selectQuery = query.select(field, table, condition)

      try {
        const client = await pool.connect()
        const result = await client.query(selectQuery)
        const data = result && result.rows && result.rows[0]

        res.json(formatResponse(errorCode.SUCCESS, data))
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
