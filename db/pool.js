// Connect to db
require('dotenv').load()

const { Pool } = require('pg')
const DATABASE_URL = 'postgres://fhweuxasodfldx:c8b3ea07b36952ba0bb6b05077dbf4eddfaea2fbf4de1c3f015b7fedf0066243@ec2-54-235-193-0.compute-1.amazonaws.com:5432/d138c5ifipa87c'
const NODE_ENV = 'development'
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: NODE_ENV === 'development' ? false : true
})

module.exports = pool
