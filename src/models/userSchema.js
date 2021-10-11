import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      maxLength: 80,
    },
    avatar: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Facebook_icon.svg/1200px-Facebook_icon.svg.png",
    },
    password: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },

  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

UserSchema.statics.checkUserCredentials = async function (
  email,
  userGivenPassword
) {
  const findUser = await this.findOne({ email });

  if (await bcrypt.compare(userGivenPassword, findUser.password)) {
    return findUser;
  } else {
    return null;
  }
};

export default model('User', UserSchema);
