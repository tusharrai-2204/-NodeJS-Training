/*
"Write apis for Book resource also follow the mvc structure to do the same:
API NAME - API URL - METHOD
---------------------------------------------
1. Get One Book (/books/1) -- GET
2. Get All Book  (/books) -- GET
3. Create Book (/books) -- POST
4. Update Book (/books/1) -- PUT
5. Delete Book (/books/1) -- DELETE

As of now, store the book details in a local variable. Fields of book will be BookId, BookName, Author, Price, Pages"
*/

import express from 'express';
import bookRouter from './routes/book.routes';

const app = express();
app.use(express.json());

app.use('/books', bookRouter);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});