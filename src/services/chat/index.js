import express from "express";
import chatSchema from "../../models/chatSchema.js";
import userSchema from "../../models/userSchema.js";
import { JWTAuthMiddleware } from "../auth/middlewares.js";

const chatRouter = express.Router();

chatRouter.get("/", async (req, res, next) => {
  try {
    const chat = await chatSchema.find().populate("members");
    // const message = await chatSchema.find().populate("history");

    res.send(chat);
  } catch (error) {
    console.log(error);
  }
});

chatRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = req.user;

    const findMember = await chatSchema.find();

    console.log(findMember);
    console.log(user._id);
    console.log(!findMember.roomChatName);
    console.log(findMember[0].members < 1);

    if (findMember[0].members < 1) {
    }

    if (findMember) {
      // findMember[0].members.find((m) => console.log(m));
      // console.log(user._id);
      const memberInChat = findMember[0].members.find(
        (m) => m.toString() === user._id.toString()
      );

      if (memberInChat) {
      } else {
      }
    }

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
