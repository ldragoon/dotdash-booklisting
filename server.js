const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.port || 3000
const fetch = require('node-fetch')
const convert = require('xml-js')

require('dotenv').config()
const key = process.env.API_KEY
const url = 'https://www.goodreads.com/search.xml?key=' + key + '&q=Magic%27s+Promise'

app.listen(port, () => {
  console.log(`Book list app listening at http://localhost:${port}`)
})

app.use(cors())

app.get('/:type/:id', (req, res, next) => {
  const id = req.params.id
  const type = req.params.type

  console.log(`id: ${id}, type: ${type}`)

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
