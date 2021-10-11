import express, { Router } from "express";
import userSchema from "../../models/userSchema.js";
import { JWTAuthenticate } from "../auth/tools.js";

const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = await userSchema.create(req.body);

    res.send(newUser);
  } catch (error) {
    next(error);
  }
});

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
