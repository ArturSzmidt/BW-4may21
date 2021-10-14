import mongoose from "mongoose";
import messageSchema from "./messageSchema.js";

const { Schema, model } = mongoose;

const chatSchema = new Schema({
  // members: {
  //   type: Array,
  // },

  roomChatName: {
    type: String,
    default: "New room",
  },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  history: { type: [messageSchema] },
  // history: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  // history: [
  //   {
  //     sender: {
  //       type: String,
  //     },
  //     content: {
  //       text: String,
  //       media: String,
  //     },
  //   },
  // ],
});

export default model("chat", chatSchema);
