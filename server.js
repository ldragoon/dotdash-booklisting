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

app.get('/authorId/:query/:pagenum', async (req, res) => {
  let query = encodeURI(req.params.query)

  // need to access this link first to get the authorid which allows you 
  // to access the nicely formatted paginated list of books.
  const base_url = 'https://www.goodreads.com/search/index.xml?key=' + key
  let url = base_url + '&q=' + query
  let parsedQuery = querystring.parse(url)
  let page = req.params.pagenum

  try {
    const response = await fetch(url)
    const xml = await response.text()

    if ( parser.validate(xml) !== true ) throw new Error('Response is not XML')
    const json = parser.parse(xml)
    const _work = json.GoodreadsResponse.search.results.work
    
    if ( typeof _work !== 'object' ) throw new Error('work is not an object')
    const work = _work.shift()
    const authorId = work.best_book.author['id']
    const authorIdUrl = 'https://www.goodreads.com/author/list.xml?key=' + key + '&id=' + authorId + '&page=' + page
    try {
      const finalResponse = await fetch(authorIdUrl)
      const finalXml = await finalResponse.text()
      if ( parser.validate(finalXml) !== true ) throw new Error('Response is not XML')
      const data = parser.parse(finalXml, {
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
    } catch (error) {
      console.log('Error: ', error)
    }
  } catch (error) {
    console.log('Error: ', error)
  }
})