const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const authRoutes = require('./routes/authRoutes');
const database = require('./config/database');
const path = require("path");
const Message = require('./models/message');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '../public')))


app.use(express.json());

app.use('/api/auth', authRoutes);
app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '../public/chat.html');
});


const connectedUsers = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  // Add user to connectedUsers object
  socket.on('add user', (userId, username) => {
    console.log("tetetetetetetete")
    console.log(userId,username)
    socket.user_id = userId;
    socket.username = username;
    connectedUsers.userId = userId;
    connectedUsers.username = username;
    console.log(connectedUsers)

    // Emit updated user list to all clients
    io.emit('user list', Object.keys(connectedUsers));
  });

  // Emit message history to newly connected user
  Message.find()
    .populate('user_id', 'username')
    .then(messages => {
      socket.emit('message history', messages);
    })
    .catch(error => {
      console.error('Error fetching message history:', error);
    });

  // Listen for new chat messages
  socket.on('chat message', async (msg) => {
    console.log('message: ' + msg);

    // Save message to database with correct user_id
    try {
      const newMessage = await Message.create({ message_text: msg, user_id: connectedUsers.userId });
      console.log('Message saved to DB:', newMessage);
    } catch (error) {
      console.error('Error saving message to DB:', error);
    }

    // Broadcast the message to all connected clients
    io.emit('chat message', { message: msg, username: socket.username });
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('user disconnected');
    if (socket.user_id) {
      delete connectedUsers[socket.user_id];
      io.emit('user list', Object.keys(connectedUsers));
    }
  });
});

// io.on('connection', (socket) => {
//   console.log('a user connected');

//   // Add user to connectedUsers object
//   socket.on('add user', (username) => {
//     socket.username = username;
//     connectedUsers[username] = true;

//     // Emit updated user list to all clients
//     io.emit('user list', Object.keys(connectedUsers));
//   });

//   // Emit message history to newly connected user
//   Message.find()
//     .populate('user_id', 'username')
//     .then(messages => {
//       socket.emit('message history', messages);
//     })
//     .catch(error => {
//       console.error('Error fetching message history:', error);
//     });

//   // Listen for new chat messages
//   socket.on('chat message', async (msg) => {
//     console.log('message: ' + msg);

//     // Save message to database
//     try {
//       console.log(socket)
//       const newMessage = await Message.create({ message_text: msg, user_id: socket.user_id });
//       console.log('Message saved to DB:', newMessage);
//     } catch (error) {
//       console.error('Error saving message to DB:', error);
//     }

//     // Broadcast the message to all connected clients
//     io.emit('chat message', { message: msg, username: socket.username });
//   });

//   // Handle user disconnection
//   socket.on('disconnect', () => {
//     console.log('user disconnected');
//     if (socket.username) {
//       delete connectedUsers[socket.username];
//       io.emit('user list', Object.keys(connectedUsers));
//     }
//   });
// });





const PORT = 8888;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
