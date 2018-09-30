const errorCode = require('../../constants/errorCode')
const { client, query } = require('../../db')
require('../../utils')()

module.exports = function addPlayerApi(app) {
  app.post('/v1/player/sync', async (req, res) => {
    let body = req.body

    try {
      if (!body) throw errorCode.WRONG_API

      const { playerID, playerName, avatar, bestScore } = body
      if (!playerID) throw errorCode.WRONG_API

      const listField = [
        'player_id',
        'player_name',
        'avatar',
        'best_score',
        'update_time'
      ]
      const listValue = [
        playerID,
        playerName,
        avatar,
        bestScore,
        Date.now() / 1000
      ]

      const updateValue = query.joinFieldValue(listField, listValue)
      const updateCondition = query.joinFieldValue(['player_id'], [playerID])
      const updateQuery = query.update('player', updateValue, updateCondition)

      const insertValues = query.joinListValue(listValue)

      try {
        await client.connect()
        const result = await client.transactionQuery([updateQuery])

        if (result.rowCount === 0) {
          const insertQuery = query.insertInto(
            'player',
            undefined,
            insertValues
          )
          await client.transactionQuery([insertQuery])
        }

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
