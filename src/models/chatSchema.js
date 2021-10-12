import mongoose from "mongoose";

const { Schema, model } = mongoose;

const chatSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  history: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  //history: [{ type: Schema.Types.ObjectId, ref: "Message" }],
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
