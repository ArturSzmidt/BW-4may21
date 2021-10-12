import mongoose from "mongoose";

const { model, Schema } = mongoose;

const messageSchema = new Schema({
  timestamp: {
    type: Number,
  },
  chatId: {
    type: String,
  },
  sender: {
    type: String,
  },
  content: {
    text: String,
    media: String,
  },
});

export default model("message", messageSchema);
