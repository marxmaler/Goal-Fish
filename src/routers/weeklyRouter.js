import express from "express";
import { protectorMiddleware } from "../../middlewares";
import {
  getWeeklyHome,
  getEditWeekly,
  getNewWeekly,
  postEditWeekly,
  postNewWeekly,
  getPreviousWeekly,
} from "../controllers/weeklyController";

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
weeklyRouter.route("/previous").all(protectorMiddleware).get(getPreviousWeekly);
weeklyRouter.route("/:id").all(protectorMiddleware).get(getPreviousWeekly);
export default weeklyRouter;
