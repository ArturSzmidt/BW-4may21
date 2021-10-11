import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const MessageSchema = new Schema({
  text: { type: String, required: True },
  sender: { type: String, required: True },
  id: { type: String, required: True },
});

const RoomSchema = new Schema({
  name: { type: String, required: True },
});

export default model('Room', RoomSchema);
