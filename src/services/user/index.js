import express, { Router } from "express";
import { JWTAuthenticate } from "../auth/tools.js";
import { JWTAuthMiddleware } from "../auth/middlewares.js";
import userModel from "../../models/userSchema.js";

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import createHttpError from "http-errors";

const cloudinaryStora = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "userProfile",
  },
});

const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = await userModel.create(req.body);

    res.send(newUser);
  } catch (error) {
    next(error);
  }
});
userRouter.post(
  "/me/:userId",
  multer({ storage: cloudinaryStora }).single("avatar"),

<<<<<<< Updated upstream
userRouter.post(
  "/me/:userId",
  multer({ storage: cloudinaryStora }).single("avatar"),

  async (req, res, next) => {
    try {
      const modifiedUser = await userModel.findByIdAndUpdate(
=======
  async (req, res, next) => {
    try {
      const modifiedUser = await userSchema.findByIdAndUpdate(
>>>>>>> Stashed changes
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

    const findUser = await userModel.checkUserCredentials(email, password);

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

userRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    user = req.body;
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// userRouter.get('')

export default userRouter;
