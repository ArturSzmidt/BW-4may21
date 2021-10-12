import express from "express";
import { JWTAuthenticate } from "../auth/tools.js";
import { JWTAuthMiddleware } from "../auth/middlewares.js";
import userModel from "../../models/userSchema.js";
import q2m from "query-to-mongo";

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

  async (req, res, next) => {
    try {
      const modifiedUser = await userModel.findByIdAndUpdate(
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

userRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);

    const findUserByQuery = await userModel.find(
      query.criteria,
      query.options.fields
    );

    res.send(findUserByQuery);
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

userRouter.get("/me/:userId", async (req, res, next) => {
  try {
    const findUser = await userModel.findOne({ _id: req.params.userId });

    if (findUser) {
      res.send(findUser);
    } else {
      console.log("User not found");
    }
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
