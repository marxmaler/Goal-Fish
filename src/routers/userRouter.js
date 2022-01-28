import express from "express";
import { route } from "express/lib/application";
import passport from "passport";
import { protectorMiddleware, publicOnlyMiddleware } from "../../middlewares";
import {
  checkEmail,
  logout,
  startGithubAuth,
  finishGithubAuth,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter
  .route("/join/check/email")
  .all(publicOnlyMiddleware)
  .post(checkEmail);
userRouter.route("/logout").all(protectorMiddleware).get(logout);
userRouter.route("/auth/github").all(publicOnlyMiddleware).get(startGithubAuth);
userRouter
  .route("/auth/github/finish")
  .all(publicOnlyMiddleware)
  .get(finishGithubAuth);
userRouter
  .route("/auth/google")
  .all(publicOnlyMiddleware)
  .get(passport.authenticate("google", { scope: ["email", "profile"] }));
userRouter
  .route("/auth/google/finish")
  .all(publicOnlyMiddleware)
  .get(
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      req.session.loggedIn = true;
      req.session.user = req.user;
      res.redirect("/");
    }
  );
userRouter
  .route("/auth/kakao")
  .all(publicOnlyMiddleware)
  .get(
    passport.authenticate("kakao-login", {
      scope: ["profile_nickname", "account_email"],
    })
  );
userRouter
  .route("/auth/kakao/finish")
  .all(publicOnlyMiddleware)
  .get(
    passport.authenticate("kakao-login", { failureRedirect: "/login" }),
    (req, res) => {
      req.session.loggedIn = true;
      req.session.user = req.user;
      res.redirect("/");
    }
  );
userRouter
  .route("/auth/naver")
  .all(publicOnlyMiddleware)
  .get(
    passport.authenticate("naver", {
      scope: ["profile_nickname", "account_email"],
    })
  );
userRouter
  .route("/auth/naver/finish")
  .all(publicOnlyMiddleware)
  .get(
    passport.authenticate("naver", { failureRedirect: "/login" }),
    (req, res) => {
      req.session.loggedIn = true;
      req.session.user = req.user;
      res.redirect("/");
    }
  );

export default userRouter;