import express from "express";
import { protectorMiddleware } from "../middlewares";
import {
  getWeeklyHome,
  getEditWeekly,
  getNewWeekly,
  postEditWeekly,
  postNewWeekly,
} from "../controllers/weeklyController";
import { getPreviousGoal } from "../controllers/goalController";

const weeklyRouter = express.Router();

weeklyRouter.route("/").all(protectorMiddleware).get(getWeeklyHome);
weeklyRouter
  .route("/add")
  .all(protectorMiddleware)
  .get(getNewWeekly)
  .post(postNewWeekly);
weeklyRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEditWeekly)
  .post(postEditWeekly);
weeklyRouter.route("/previous/").all(protectorMiddleware).get(getPreviousGoal);
weeklyRouter
  .route("/previous/:id")
  .all(protectorMiddleware)
  .get(getPreviousGoal);
export default weeklyRouter;
