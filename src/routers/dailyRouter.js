import express from "express";
import { protectorMiddleware } from "../middlewares";
import {
  getEditDaily,
  getNewDaily,
  postEditDaily,
  postNewDaily,
} from "../controllers/dailyController";
import { getPreviousGoal } from "../controllers/goalController";

const dailyRouter = express.Router();

dailyRouter
  .route("/add")
  .all(protectorMiddleware)
  .get(getNewDaily)
  .post(postNewDaily);
dailyRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEditDaily)
  .post(postEditDaily);
dailyRouter.route("/previous/").all(protectorMiddleware).get(getPreviousGoal);
dailyRouter.route("/:date").all(protectorMiddleware).get(getPreviousGoal);

export default dailyRouter;
