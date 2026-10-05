// "1. Create a local variable which stores the list of books with fields: BookId, BookName, Author, Price, Pages
// 2. Create a server in nodejs and it should return a book list as response."

const http = require('http');
const books = require('./books');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/books') {
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify(books));
    return;
  }

  res.statusCode = 404;
  res.end("Not Found");
  console.log("Not Found");
  return;
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
})