const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.port || 3000
const fetch = require('node-fetch')
const parser = require('fast-xml-parser')

require('dotenv').config()

const key = process.env.API_KEY
const base_url = 'https://www.goodreads.com/search.xml?key=' + key + '&q='

app.use(cors())

app.listen(port, (err) => {
  if (err) throw err
  console.log(`Book list app listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
	res.send('Hello little book listing app');
});

app.get('/:query', (req, res, next) => {
  let query = encodeURI(req.params.query)
  let url = base_url + query

  console.log(`url: ${url}`)
  
  fetch(url)
    .then(res => res.text())
    .then(xml => {
      if ( parser.validate(xml) === true ) {
        // optional (it'll return an object in case it's not valid)
        const data = parser.parse(xml, {
          attributeNamePrefix : '',
          attrNodeName: false,
          textNodeName: 'text',
          trimValues: true,
          arrayMode: false
        })

        if ( !data ) data = {
          "error": "this item doesn't exist"
        }
        res.send(data)
      }      
    })
    .catch(err => console.error(err))
})