# Small Book-Listing App

## Small book-listing app

Vue/CSS/JS
server-side orchestration layer in Node.js
proxyies & transforms [Goodreads Public API](https://www.goodreads.com/api/index#search.books)

As of December 2020 GoodReads no longer requires keys & it's going to retire the tools

So that our team can review your code beforehand as well as during the interview, we ask that you use an online dev environment to host your work.
We recommend using Repl.it for the server, as it supports most mainstream languages, including external package dependencies.

The front-end portion should be built using Codepen.io -- either using their “Vue pen” templating or a standard HTML+CSS+JS template with manual App initialization.
Both of these sites offer free signup.

### Server

[Repl.it](https://replit.com/)

### Front-End

[CodePen.io](https://codepen.io/)

Steps:

1. Build an endpoint using Repl.it that accepts search and pagination info. Keep RESTful practices in mind, and please note that you will need to enable CORS headers to access your data from the client-side.
   1. [Search](https://www.goodreads.com/api/index#search.books)
   2. [Pagination](https://www.goodreads.com/api/index#author.books)

2. Extend the endpoint to connect to the Goodreads search API. Note that the API returns XML;  transform the XML into JSON and only return what your app will need.

3. Build an application in Codepen that hits the endpoint you created in Repl.it. At a minimum, your application should contain a search box that upon enter, or click of a "Search" button, triggers a search against your API. The results should be listed on the app. It's up to you what metadata you'd like to render for each book, and how you want to handle display states for pagination, errors, etc.
