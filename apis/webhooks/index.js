module.exports = function addWebhookApi(app) {
  // Creates the endpoint for our webhook
  app.post('/', (req, res) => {
    let body = req.body

    // Checks this is an event from a page subscription
    if (body.object === 'page') {
      console.log('LOG BODY ENTRY')
      console.log(body.entry)
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
        console.log('LOG WEBHOOK EVENT')
        // Gets the message. entry.messaging is an array, but
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0]
        console.log(webhook_event)
      })

      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED')
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404)
    }
  })

  // Adds support for GET requests to our webhook
  app.get('/', (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = 'MY_VERIFY_TOKEN'

    // Parse the query params
    let mode = req.query['hub.mode']
    let token = req.query['hub.verify_token']
    let challenge = req.query['hub.challenge']

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED')
        res.status(200).send(challenge)
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.status(403)
      }
    }
  })
}
