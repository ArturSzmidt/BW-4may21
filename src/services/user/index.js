import express from "express";
import userSchema from "../../models/userSchema.js";
import { JWTAuthenticate } from "../auth/tools.js";

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import createHttpError from "http-errors";

const userRouter = express.Router();

const cloudinaryStora = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "userProfile",
  },
});

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = await userSchema.create(req.body);

    res.send(newUser);
  } catch (error) {
    next(error);
  }
});

userRouter.post(
  "/me/:userId",
  multer({ storage: cloudinaryStora }).single("avatar"),

  async (req, res, next) => {
    try {
      const modifiedUser = await userSchema.findByIdAndUpdate(
        req.params.userId,
        {
          avatar: req.file.path,
        },
        {
          new: true,
        }
      );

      if (modifiedUser) {
        res.send(modifiedUser);
      } else {
        next(
          createError(404, `Profile with id ${req.params.userId} not found!`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const findUser = await userSchema.checkUserCredentials(email, password);

    if (findUser) {
      const { accessToken, refreshToken } = await JWTAuthenticate(findUser);
      res.send({ accessToken, refreshToken });
    } else {
      console.log("Credentials are not ok!");
    }
  } catch (error) {
    next(error);
  }
});

// userRouter.get('')

export default userRouter;
