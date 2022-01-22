import express from "express";
import { getDailyHome } from "../controllers/dailyController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";

const globalRouter = express.Router();
globalRouter.route("/").get(getDailyHome);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);

export default globalRouter;
