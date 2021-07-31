const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const fetch = require('node-fetch')
const convert = require('xml-js')
const envalid = require('envalid')

require('dotenv').config()
const key = process.env.API_KEY
const url = 'https://www.goodreads.com/search.xml?key=' + key + '&q=Magic%27s+Promise'

const env = envalid.cleanEnv(process.env, {
  PGSTRING: envalid.url(),
})

app.use(cors())

app.get('/', (req, res, next) => {
  fetch(url)
    .then(res => res.text())
    .then(body => {
      const data = convert.xml2json(body, {
        compact: true, spaces: 4
      })
      res.send(data)
    })
    .catch(err => console.error(err))
})

app.post('/', (req, res, next) => {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml'
    }
  })
    .then(res => res.text())
    .then(body => {
      const data = convert.xml2json(body, {
        compact: true, spaces: 4
      })
      res.send(data)
    })
    .catch(err => console.error(err))
})

app.listen(port, () => {
  console.log(`Book list app listening at http://localhost:${port}`)
})
