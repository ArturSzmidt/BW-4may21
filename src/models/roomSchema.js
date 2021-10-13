import mongoose from 'mongoose';
//import user model??
const { Schema, model } = mongoose;

const MessageSchema = new Schema({
  message: { type: String, required: true, default: 'Generic message' },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  id: { type: String },
});

const RoomSchema = new Schema({
  name: { type: String, default: 'New Room' },
  participants: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    default: undefined,
    required: true,
  },
  chatHistory: { type: [MessageSchema], default: [] },
});

export default model('Room', RoomSchema);
