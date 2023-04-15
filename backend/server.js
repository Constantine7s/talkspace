const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 8000;

app.use(cors());

const chats = require('./data');

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/api/chat', (req, res) => {
  res.send(chats);
});

app.get('/api/chat/:id', (req, res) => {
  const chat = chats.find((c) => c._id === req.params.id);
  res.send(chat);
});

app.listen(port, () => {
  console.log('Your server is single and ready to mingle at port ' + port);
});
