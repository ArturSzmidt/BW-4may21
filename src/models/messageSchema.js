import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
  timestamp: {
    type: Number,
  },
  sender: {
    type: String,
  },
  content: {
    text: String,
    media: String,
  },
});

export default messageSchema;
