const express = require('express')
const cors = require('cors')
const querystring = require('querystring')
const app = express()
const port = process.env.port || 3000
const fetch = require('node-fetch')
const parser = require('fast-xml-parser')

require('dotenv').config()

const key = process.env.API_KEY

app.use(cors())

app.listen(port, (err) => {
  if (err) throw err
  console.log(`Book list app listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
	res.send('Hello little book listing app')
});

app.get('/authorId/:query/:pagenum', (req, res, next) => {
  let query = encodeURI(req.params.query)
  // need to access this link first to get the authorid which allows you 
  // to access the nicely formatted paginated list of books.
  const base_url = 'https://www.goodreads.com/search/index.xml?key=' + key
  let url = base_url + '&q=' + query
  let parsedQuery = querystring.parse(url)
  let page = req.params.pagenum

  fetch(url)
    .then(res => res.text())
    .then(xml => {
      const json = parser.parse(xml)
      const _work = json.GoodreadsResponse.search.results.work
      if ( typeof _work === 'object' ) {
        const work = _work.shift();
        const authorId = work.best_book.author['id']
        const authorIdUrl = 'https://www.goodreads.com/author/list.xml?key=' + key + '&id=' + authorId + '&page=' + page
        fetch(authorIdUrl)
          .then(res => res.text())
          .then(xml => {
            if ( parser.validate(xml) === true ) {
              // optional (it'll return an object in case it's not valid)
              const data = parser.parse(xml, {
                attributeNamePrefix : '',
                attrNodeName: false,
                textNodeName: 'text',
                ignoreAttributes: false,
                trimValues: true,
                arrayMode: false
              })
              
              if ( !data ) data = {
                "error": "this item doesn't exist"
              }
              res.send(data.GoodreadsResponse.author)
            }
          })
          .catch(err => console.error(err))
      }
    })
    .catch(err => console.error(err))
})