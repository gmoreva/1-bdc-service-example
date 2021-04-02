const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const axios = require('axios')
const client = require('./client')
const otherServiceUrl = process.env.OTHER_SERVICE
if (!otherServiceUrl) {
  console.log('other service is not set')
  process.exit()
}
const cors = require('cors');
app.use(cors());
app.options('*', cors());

const handleReq = async () => {
  const last = await client.query('select i from mytable order by i desc limit 1')
  let toInsert = 0
  if (last.rows.length === 0) {
    toInsert = 1
  } else {
    toInsert = last.rows[0].i + 1
  }
  await client.query('insert into mytable (i) values ($1)', [toInsert])
}
const run = async () => {
  await client.connect()
  await client.query('CREATE TABLE IF NOT EXISTS mytable (i integer);')
  app.get('/set-increment', async (req, res) => {
    await handleReq()
    res.send('increment updated')
  })

  app.get('/get-increment', async (req, res) => {
    const result = await client.query('select max(i) from mytable')
    res.send({ max: result.rows[0].max })
  })

  app.get('/get-increment-from-service', async (req, res) => {
    const { data } = await axios.get(otherServiceUrl+ '/get-increment')
    console.log(data)
    res.send(data)
  })

  app.get('/set-increment-on-service', async (req, res) => {
    const { data } = await axios.get(otherServiceUrl+ '/set-increment')
    res.send(data)
  })

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

run()
