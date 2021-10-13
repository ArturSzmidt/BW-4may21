import express from 'express';
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import mongoose from 'mongoose';
import userRouter from './services/user/index.js';
import chatRouter from './services/chat/index.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import colors from 'colors';

import {
  forbiddenErrHandler,
  serverErrHandler,
  badReqErrHandler,
  notFoundErrHandler,
} from './errorHandlers.js';
import messageRouter from './services/message/index.js';
import RoomModel from './models/roomSchema.js';

let onlineUsers = [];

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());
server.use(express.json());

// **************Router**********************

server.use('/users', userRouter);
server.use('/chats', chatRouter);
server.use('/message', messageRouter);

//****************SOCKET*****************************
// const httpServer = createServer(server);

// server.get('/online-users', (req, res) => {
//   res.status(200).send({ onlineUsers });
// });

// server.get('/rooms/:name', async (req, res) => {
//   const room = await RoomModel.findOne({ room: req.params.name });

//   res.send(room.chatHistory);
// });

// const io = new Server(httpServer, { allowEIO3: true });

// io.on('connection', (socket) => {
//   console.log(socket.id);

//   socket.on('setUsername', ({ username, room }) => {
//     console.log(username);

//     socket.join(room);

//     console.log(socket.rooms);

//     onlineUsers.push({ username, id: socket.id, room });

//     socket.emit('loggedin');

//     socket.broadcast.emit('newConnection');
//   });

//   socket.on('sendmessage', async ({ message, room }) => {
//     // const { text, sender, id, timestamp } = message

//     // ... we should save the message to the database here...

//     await RoomModel.findOneAndUpdate(
//       { room },
//       {
//         $push: { chatHistory: message },
//       }
//     );

//     // ... and then broadcast the message to the recipient(s)
//     // socket.broadcast.emit("message", message)
//     socket.to(room).emit('message', message);
//   });
//   socket.on('disconnect', () => {
//     onlineUsers = onlineUsers.filter((u) => u.id !== socket.id);
//     socket.broadcast.emit('newConnection');
//   });
// });

//copy

export const sockets = {};

const httpServer = createServer(server);
const io = new Server(httpServer, { allowEIO3: true });

io.on('connection', (socket) => {
  // console.log(socket);

  socket.on('did-connect', ({ userId }) => {
    console.log(userId);
    sockets[userId] = socket;
    // try {
    //   const rooms = await RoomModel.find({ participants: userId });
    //   for (let room of rooms) socket.join(room._id.toString());
    // } catch (error) {
    //   console.log('error:', error);
    // }
  });

  socket.on('joinRoom', async (roomId) => {
    socket.join(roomId);
  });

  socket.on('sendMessage', async ({ message, roomId }) => {
    //socket.join(roomId);
    //const room = await RoomModel.findById(roomId);
    console.log(message);
    console.log(roomId);

    await RoomModel.findByIdAndUpdate(roomId, {
      $push: { chatHistory: message },
    });
    socket.to(roomId).emit('message', message);
  });

  socket.on('login', ({ userId }) => {
    shared.onlineUsers.push({ userId, socketId: socket.id, socket });

    //socket.join(room);
    console.log(socket.rooms);

    // Emits to everyone excluding this client
    socket.broadcast.emit('newLogin');
    socket.emit('loggedin', { message: 'hello world' });
  });

  socket.on('log-rooms', () => {
    console.log('ROOMS', socket.rooms);
  });

  socket.on('disconnect', (userId) => {
    delete socket[userId];
    console.log('disconnected');
  });
});

//pasta

// mongoose.connect(process.env.MONGODB_CONNECT);

// mongoose.connection.on("connected", () => {
//   console.log("SUCCESS: connected to MONGODB");
//   server.listen(PORT, () => {
//     console.table(listEndpoints(server));
//     console.log("SERVER listening on: " + PORT);
//   });
// });

//changed to httpServer

mongoose.connect(process.env.MONGODB_CONNECT).then(() => {
  console.log('SUCCESS: connected to MONGODB');
  httpServer.listen(PORT, () => {
    console.table(listEndpoints(server));
    console.log('SERVER listening on port: '.random + PORT);
  });
});
