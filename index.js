import express from 'express';
import { PORT, mongoURL } from './config.js';
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';

const app = express();

/* middleware for passing request body */
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Home page is here');
  console.log('reached the home page');
});

app.get('/about', (req, res) => {
  res.send('About page');
});

app.get('/contact', (req, res) => {
  res.send('Contact page');
});

/* route to save a new book */
app.post('/books', async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({ message: 'Send all required fields' });
    }
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
    };
    const book = await Book.create(newBook);
    return res.status(201).send(book);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

/* route to get all data from database */
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find({});
    res.send(books);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

/* route to get one book by ID */

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.send(book);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

/* route to update a book by ID */
app.put('/books/:id', async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({
        message: 'Send all required fields: title , author,  publishYear',
      });
    }

    const { id } = req.params;
    const result = await Book.findByIdAndUpdate(id, req.body);

    if (!result) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).send({ result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

/* route for deleting a book--by id------------------------------------- */
app.delete('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.json({ message: 'Book not found' });
    } else {
      return res.status(200).send({ message: 'Book deleted successfully' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});
/* route for deleting a book by its title------------------------- */

app.delete('/books/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const book = await Book.findOneAndDelete({ title });
    if (!book) {
      return res.json({ message: 'Book not found' });
    } else {
      return res.status(200).send({ message: 'Book deleted successfully' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

/* mongodb database------------------------------------------------ */
mongoose
  .connect(mongoURL)
  .then(() => {
    console.log('App connected to the database');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
