import express from "express";
import passport from "passport";
import {
  checkEmail,
  logout,
  startGithubAuth,
  finishGithubAuth,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.route("/join/check/email").post(checkEmail);
userRouter.get("/logout", logout);
userRouter.get("/auth/github", startGithubAuth);
userRouter.get("/auth/github/finish", finishGithubAuth);
userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
userRouter.get(
  "/auth/google/finish",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.loggedIn = true;
    req.session.user = req.user;
    res.redirect("/");
  }
);

export default userRouter;
