'use strict'

// Local import
require('./utils')()
const apis = require('./apis')

// Imports dependencies and set up http server
const express = require('express')
const bodyParser = require('body-parser')
const app = express().use(bodyParser.json()) // creates express http server

const port = process.env.PORT || 1337
app.listen(port, () => console.log('webhook is listening in port: ' + port))

apis.addContextApi(app)
apis.addWebhooksApi(app)
apis.addPlayerApi(app)
