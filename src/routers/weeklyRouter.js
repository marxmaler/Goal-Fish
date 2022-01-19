import express from "express";
import {
  getWeeklyHome,
  getEditWeekly,
  getNewWeekly,
  postEditWeekly,
  postNewWeekly,
  getPreviousWeekly,
  postPreviousWeekly,
} from "../controllers/weeklyController";

const weeklyRouter = express.Router();

weeklyRouter.route("/").get(getWeeklyHome);
weeklyRouter.route("/add").get(getNewWeekly).post(postNewWeekly);
weeklyRouter.route("/edit").get(getEditWeekly).post(postEditWeekly);
weeklyRouter.route("/:id").get(getPreviousWeekly).post(postPreviousWeekly);

export default weeklyRouter;
