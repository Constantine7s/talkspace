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
  console.log('connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', (room) => {
    console.log('Joined room: ', room);
    socket.join(room);
  });

  socket.on('new message', (newMessage) => {
    let chat = newMessage.chat;
    if (!chat.users) return console.log('chat.users not defined');
    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) return;
      console.log('message recieved')
      socket.in(user._id).emit('message received', newMessage);
    });
  });

  socket.on('typing', (room) => socket.in(room).emit("typing"))
  socket.on('stop typing', (room) => socket.in(room).emit("stop typing"))

  socket.off('setup', () => {
    console.log('User disconnected');
    socket.leave(userData._id)
  })
});

