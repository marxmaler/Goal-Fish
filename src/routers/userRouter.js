import express from "express";
import { checkUsername, checkEmail } from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/join/check/username").post(checkUsername);
userRouter.route("/join/check/email").post(checkEmail);

export default userRouter;
