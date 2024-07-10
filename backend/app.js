require('dotenv').config();
require('./services/scheduledService');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const booksRouter = require('./routes/booksRouter');
const usersRouter = require('./routes/usersRouter');
const witAiRouter = require('./routes/witAiRouter');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(booksRouter);
app.use(usersRouter);
app.use(witAiRouter);
app.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});

mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log('Connected to Database.');
    })
    .catch((e) => console.log(e));
