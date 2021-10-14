import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import userRouter from "./services/user/index.js";
import chatRouter from "./services/chat/index.js";
import { createServer } from "http";
import { Server } from "socket.io";
import colors from "colors";

console.log("event was fired🔥  :", "everything is ok".cyan);

import {
  forbiddenErrHandler,
  serverErrHandler,
  badReqErrHandler,
  notFoundErrHandler,
} from "./errorHandlers.js";
import messageRouter from "./services/message/index.js";
import { verifyJWT } from "./services/auth/tools.js";

//import routers
//models import
//import shared
//socket imports
// import { Server } from 'socket.io';
// import { createServer } from 'http';

const PORT = process.env.PORT || 3000;

const server = express();

server.use(cors());
server.use(express.json());

const httpServer = createServer(server);

const io = new Server(httpServer, { allowEIO3: true });

export const sockets = {};

io.on("connection", async (socket) => {
  console.log(socket.id);

  console.log(socket.request.headers.authorization);

  const { _id: userId } = await verifyJWT(socket.request.headers.authorization);
  sockets[userId] = socket;

  console.log(socket.rooms);

  socket.on("setUsername", (payload) => {
    console.log(payload);
    // console.log();
  });

  socket.on("loggedIn", () => {
    socket.emit("welcome", { message: "welcome" });

    // send a message to every body
    socket.broadcast.emit("newOnlineUser", { id: socket.id });
  });
});

// **************Router**********************

server.use("/users", userRouter);
server.use("/chats", chatRouter);
server.use("/messages", messageRouter);

// mongoose.connect(process.env.MONGODB_CONNECT);

// mongoose.connection.on("connected", () => {
//   console.log("SUCCESS: connected to MONGODB");
//   server.listen(PORT, () => {
//     console.table(listEndpoints(server));
//     console.log("SERVER listening on: " + PORT);
//   });
// });
// httpServer.listen(PORT, () => {
//   console.table(listEndpoints(server));
//   console.log("SERVER listening on: " + PORT);
// });
mongoose
  .connect(process.env.MONGODB_CONNECT, { useNewUrlParser: true })
  .then(() => {
    console.log("SUCCESS: connected to MONGODB");
    httpServer.listen(PORT, () => {
      console.table(listEndpoints(server));
      console.log("SERVER listening on: " + PORT);
    });
  });
