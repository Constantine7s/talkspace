const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const port = process.env.PORT || 8000;
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(errorHandler);
app.use(notFound);

const server = app.listen(port, () => {
  console.log('Your server is single and ready to mingle at port ' + port);
});

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: { origin: 'http://localhost:3000' },
});

io.on('connection', (socket) => {
  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });
});
