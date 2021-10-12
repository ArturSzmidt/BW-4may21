import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import userRouter from "./services/user/index.js";
import chatRouter from "./services/chat/index.js";
import { createServer } from "http";
import { Server } from "socket.io";

import {
  forbiddenErrHandler,
  serverErrHandler,
  badReqErrHandler,
  notFoundErrHandler,
} from "./errorHandlers.js";
import messageRouter from "./services/message/index.js";

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

io.on("connection", (socket) => {
  console.log(socket.id);
});

// **************Router**********************

server.use("/users", userRouter);
server.use("/chats", chatRouter);
server.use("/message", messageRouter);

// mongoose.connect(process.env.MONGODB_CONNECT);

// mongoose.connection.on("connected", () => {
//   console.log("SUCCESS: connected to MONGODB");
//   server.listen(PORT, () => {
//     console.table(listEndpoints(server));
//     console.log("SERVER listening on: " + PORT);
//   });
// });

mongoose.connect(process.env.MONGODB_CONNECT).then(() => {
  console.log("SUCCESS: connected to MONGODB");
  server.listen(PORT, () => {
    listEndpoints(server);
    console.log("SERVER listening on: " + PORT);
  });
});
