import express from "express";
import chatSchema from "../../models/chatSchema.js";
import userSchema from "../../models/userSchema.js";

const chatRouter = express.Router();

// chatRouter.get("/", async (req, res, next) => {
//   try {
//     const chat = await chatSchema.find().populate("members");
//     // const message = await chatSchema.find().populate("history");

//     res.send({ chat, message });
//   } catch (error) {
//     console.log(error);
//   }
// });

chatRouter.get("/:userId", async (req, res) => {
  try {
    const userChat = await chatSchema.find({
      members: { $in: [req.params.userId] },
    });

    res.send(userChat);
  } catch (error) {}
});
chatRouter.post("/", async (req, res, next) => {
  try {
    const newChat = new chatSchema({
      members: [req.body.senderId, req.body.receiveId],
    });

    const saveChat = await newChat.save();

    res.send(saveChat);
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

export default chatRouter;
