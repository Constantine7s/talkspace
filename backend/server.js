const express = require('express');
const app = express();
const dotenv = require('dotenv')
const cors = require('cors');
const port = process.env.PORT || 8000;
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const connectDB = require('./config/db');
const {errorHandler, notFound} = require('./middleware/errorMiddleware')

dotenv.config()
connectDB()

app.use(cors());
app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(errorHandler)
app.use(notFound)

app.listen(port, () => {
  console.log('Your server is single and ready to mingle at port ' + port);
});
