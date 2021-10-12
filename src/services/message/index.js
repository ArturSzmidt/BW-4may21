import express from "express";
import messageSchema from "../../models/messageSchema.js";

const messageRouter = express.Router();

messageRouter.post("/", async (req, res, next) => {
  try {
    const newMessage = await messageSchema.create(req.body);

    res.send(newMessage);
  } catch (error) {
    console.log(error);
  }
});

messageRouter.get("/:chatId", async (req, res, next) => {
  try {
    const message = await messageSchema.find({
      chatId: req.params.chatId,
    });

    res.send(message);
  } catch (error) {
    console.log(error);
  }
});

export default messageRouter;
