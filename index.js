const express = require('express');
require('./dbConnection/db');
const dotenv = require('dotenv');
const todoHandler = require('./handler/todoHandler');
const userHandler = require('./handler/userHandler');

const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;

const app = express();
dotenv.config();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/todo', todoHandler);
app.use('/user', userHandler);

// error handling
const errorHandler = (err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(500).json({ err: err.message });
};
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Your server is running at http://${hostname}:${port}`);
});
