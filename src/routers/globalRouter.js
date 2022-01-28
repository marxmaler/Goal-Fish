import express from "express";
import { protectorMiddleware, publicOnlyMiddleware } from "../../middlewares";
import { getDailyHome } from "../controllers/dailyController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";

const globalRouter = express.Router();
globalRouter.route("/").all(protectorMiddleware).get(getDailyHome);
globalRouter
  .route("/join")
  .all(publicOnlyMiddleware)
  .get(getJoin)
  .post(postJoin);
globalRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);

export default globalRouter;
