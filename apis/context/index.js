const errorCode = require('../../constants/errorCode')
require('../../utils')()
const { client, query } = require('../../db')

module.exports = function addContextApi(app) {
  app.post('/v1/context/end', async (req, res) => {
    let body = req.body

    try {
      if (!body) throw errorCode.WRONG_API

      const { contextID, playerID, score } = body
      if (
        !contextID ||
        !playerID ||
        score === undefined ||
        isNaN(parseInt(score))
      )
        throw errorCode.WRONG_API

      const listField = ['score', 'is_ready', 'update_time']
      const listValue = [parseInt(score), false, Date.now() / 1000]
      const values = query.joinFieldValue(listField, listValue)

      const listFieldCondition = ['context_id', 'player_id']
      const listValueCondition = [contextID, playerID]
      const condition = query.joinFieldValue(
        listFieldCondition,
        listValueCondition,
        ' AND '
      )

      const updateQuery = query.update('match', values, condition)

      try {
        await client.connect()
        await client.transactionQuery([updateQuery])

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
        await client.connect()
        const result = await client.query(selectQuery)
        const data = result && result.rows && result.rows[0]
        const parse = data && parseData(data)

        res.json(formatResponse(errorCode.SUCCESS, parse))
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

  app.post('/v1/context/ready', async (req, res) => {
    let body = req.body

    try {
      if (!body) throw errorCode.WRONG_API

      const { contextID, playerID } = body
      const isReady = body.isReady === undefined ? true : body.isReady
      if (!contextID || !playerID) throw errorCode.WRONG_API

      const listField = [
        'context_id',
        'player_id',
        'is_ready',
        'score',
        'update_time'
      ]
      const listValue = [contextID, playerID, isReady, null, Date.now() / 1000]

      const updateValue = query.joinFieldValue(listField, listValue)
      const updateCondition = query.joinFieldValue(
        ['context_id', 'player_id'],
        [contextID, playerID],
        ' AND '
      )
      const updateQuery = query.update('match', updateValue, updateCondition)

      const insertValues = query.joinListValue(listValue)

      try {
        await client.connect()
        const result = await client.transactionQuery([updateQuery])

        if (result.rowCount === 0) {
          const insertQuery = query.insertInto('match', undefined, insertValues)
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

  app.post('/v1/context/challenge', async (req, res) => {
    let body = req.body

    try {
      if (!body) throw errorCode.WRONG_API

      const { contextID, opponentID } = body
      if (!contextID || !opponentID) throw errorCode.WRONG_API

      const listValue = [
        opponentID,
        null,
        null,
        null,
        Date.now() / 1000,
        contextID
      ]
      const insertValues = query.joinListValue(listValue)

      const updateValue = query.joinFieldValue(
        ['challenge_context'],
        [contextID]
      )
      const updateCondition = query.joinFieldValue(
        ['player_id'],
        [opponentID],
        ' AND '
      )
      const updateQuery = query.update('player', updateValue, updateCondition)

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

  app.post('/v1/context/challenge/reject', async (req, res) => {
    let body = req.body

    try {
      if (!body) throw errorCode.WRONG_API

      const { playerID, contextRejected } = body
      if (!playerID || !contextRejected) throw errorCode.WRONG_API

      const listValue = [playerID, null, null, null, Date.now() / 1000, '0']
      const insertValues = query.joinListValue(listValue)

      const updateValue = query.joinFieldValue(['challenge_context'], ['0'])
      const updateCondition = query.joinFieldValue(
        ['player_id', 'challenge_context'],
        [playerID, contextRejected],
        ' AND '
      )
      const updateQuery = query.update('player', updateValue, updateCondition)

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

  app.post('/v2/context/challenge', async (req, res) => {
    let body = req.body

    try {
      if (!body) throw errorCode.WRONG_API

      const { playerID, opponentID } = body
      if (!playerID || !opponentID) throw errorCode.WRONG_API

      const query1 = getChallengeQuery(playerID, opponentID, 'waited')
      const query2 = getChallengeQuery(opponentID, playerID, 'challenged')

      try {
        await client.connect()
        const result1 = await client.transactionQuery([query1.updateQuery])
        const result2 = await client.transactionQuery([query2.updateQuery])

        if (result1.rowCount === 0) {
          console.log('update not success: ' + playerID + ' ' + opponentID)
          await client.transactionQuery([query1.insertQuery])
        }
        if (result2.rowCount === 0) {
          console.log('update not success: ' + opponentID + ' ' + playerID)
          await client.transactionQuery([query2.insertQuery])
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

function getChallengeQuery(p1, p2, status) {
  const baseList = [null, null, null, Date.now() / 1000]
  const listValue = [p1, p2, null, null, status, ...baseList]
  const insertValues = query.joinListValue(listValue)
  const insertQuery = query.insertInto('challenge', undefined, insertValues)

  const updateValue = query.joinFieldValue(['status'], [status])
  const updateCondition = query.joinFieldValue(
    ['player_id', 'opponent_id'],
    [p1, p2],
    ' AND '
  )
  const updateQuery = query.update('challenge', updateValue, updateCondition)

  return { insertQuery, updateQuery }
}
