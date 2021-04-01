const { Client } = require('pg')
const connectionString = process.env.PG_STRING
if (!connectionString) {
  console.error('No PG_STRING in env');
}

const client = new Client({
  connectionString,
})

module.exports = client
