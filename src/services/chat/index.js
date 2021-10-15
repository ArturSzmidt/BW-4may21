import express from "express";
import chatSchema from "../../models/chatSchema.js";
import userSchema from "../../models/userSchema.js";
import { sockets } from "../../server.js";
import { JWTAuthMiddleware } from "../auth/middlewares.js";

const chatRouter = express.Router();

chatRouter.get("/sockets", JWTAuthMiddleware, (req, res) => {
  console.log(sockets);
  console.log(sockets[req.user._id]);
  console.log(sockets[req.user._id].rooms);
  res.send();
});

chatRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const chats = await chatSchema
      .find({ members: req.user._id.toString() })
      .populate("members");

    // user socket should join these chat room
    // so to receive real time events sent to that chat room

    sockets[req.user._id.toString()].join(chats.map((c) => c._id.toString()));

    console.log(sockets[req.user._id.toString()].rooms);

    res.send(chats);
  } catch (error) {
    console.log(error);
  }
});

chatRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    // find previous room

    const members = [req.user._id.toString(), ...req.body.members];

    const previousChat = await chatSchema.findOne({ members });

    let chatToSend;

    if (req.body.members.length === 1 && previousChat) {
      chatToSend = previousChat;
    } else {
      const newChatRoom = await new chatSchema({ members }).save();

      chatToSend = newChatRoom;
    }

    // every member of the chat should have their socket connected to the chat
    // for each member

    for (let member of members) {
      sockets[member]?.join(chatToSend._id.toString());
    }

    res.send(chatToSend);
  } catch (error) {
    console.log(error);
  }
});

chatRouter.get("/:userId", async (req, res) => {
  try {
    const userChat = await chatSchema.find({
      members: { $in: [req.params.userId] },
    });

    res.send(userChat);
  } catch (error) {
    console.log(error);
  }
});
export default chatRouter;
