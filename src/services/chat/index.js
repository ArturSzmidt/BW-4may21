import express from 'express';
import chatSchema from '../../models/chatSchema.js';
import userSchema from '../../models/userSchema.js';
import { sockets } from '../../server.js';
import { JWTAuthMiddleware } from '../auth/middlewares.js';

const chatRouter = express.Router();

chatRouter.get('/sockets', JWTAuthMiddleware, (req, res) => {
  console.log(sockets);
  console.log(sockets[req.user._id.toString()]);
  console.log(sockets[req.user._id.toString()].join('whateverroom'));
  console.log(sockets[req.user._id.toString()].rooms);

  res.send();
});

chatRouter.get('/', async (req, res, next) => {
  try {
    const rooms = await RoomModel.find({
      participants: req.user._id.toString(),
    });

    for (let room of rooms) {
      sockets[req.user._id.toString()].join(room._id.toString());
    }

    // sockets[req.user._id].join(rooms)

    res.send(rooms);
  } catch (error) {
    console.log('error:', error);
  }

  // try {
  //   const chat = await chatSchema.find().populate("members");
  //   // const message = await chatSchema.find().populate("history");

  //   res.send({ chat, message });
  // } catch (error) {
  //   console.log(error);
  // }
});

chatRouter.get('/:userId', async (req, res) => {
  try {
    const userChat = await chatSchema.find({
      members: { $in: [req.params.userId] },
    });

    res.send(userChat);
  } catch (error) {}
});
chatRouter.post('/', async (req, res, next) => {
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
