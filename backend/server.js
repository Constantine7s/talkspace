const express = require('express');
const app = express();
const dotenv = require('dotenv')
const cors = require('cors');
const port = process.env.PORT || 8000;
const userRoutes = require('./routes/userRoutes')
const connectDB = require('./config/db');

dotenv.config()
connectDB()

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/user', userRoutes)

app.listen(port, () => {
  console.log('Your server is single and ready to mingle at port ' + port);
});
