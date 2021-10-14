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

    // if (req.body.length === 1 && previousChat) {`
    //send the previous chat
    //return
    //}
    // else, move on:

    // const newChatRoom = await new chatSchema({
    //   members: req.user._id.toString(),
    //   ...req.body,
    // }).save();

    // res.send(newChatRoom);

    // if (findMember) {
    //   if (findMember[0].members < 1 && !findMember.roomChatName) {
    //     res.send(findMember);
    //   } else {
    //     const newChatRoom = await new chatSchema({
    //       roomChatName: req.body.roomChatName,
    //       members: user._id,
    //     }).save();
    //   }

    // const memberInChat = findMember[0].members.find(
    //   (m) => m.toString() === user._id.toString()
    // );
    // console.log(memberInChat);

    // const newChatRoom = await new chatSchema({
    //   roomChatName: req.body.roomChatName,
    //   members: user._id,
    // }).save();

    // res.send(newChatRoom);

    // const findUser = await userSchema.findById({ _id: req.body.userId });

    // const findMemberInChat = await chatSchema.findById({
    //   _id: req.body.userId,
    // });

    // console.log(findMemberInChat);

    // if (findUser) {
    //   const findMemberInChat = await chatSchema.findOneAndUpdate({ req.body.userId, {
    //     $push:{}
    //   }})
    // } else {
    //   const newChat = new chatSchema({
    //     members: req.body,
    //   });

    //   await newChat.save();

    //   console.log(newChat);
    //   res.send(newChat);
    // }

    // const newChat = new chatSchema({
    //   members: [req.body.senderId, req.body.receiveId],
    // });

    // const saveChat = await newChat.save();

    // res.send(saveChat);
    // const searchUser = await userSchema.findById(req.body.members);
    // let sender = req.body.history.sender;
    // if (searchUser) {
    //   const chat = await chatSchema.create({
    //     ...req.body,
    //     // history.sender: searchUser.name,
    //   });
    //   const { _id } = await chat.save();
    //   res.send({ _id });
    // }
    // console.log(chat);
    // console.log(req.body.user);
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
