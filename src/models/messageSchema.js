import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
  // timestamp: {
  //   type: Number,
  // },
  // sender: {
  //   type: String,
  // },
  message: {
    type: String,
  },
});

export default messageSchema;
