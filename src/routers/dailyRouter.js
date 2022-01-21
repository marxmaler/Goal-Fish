import express from "express";
import {
  getEditDaily,
  getNewDaily,
  postEditDaily,
  postNewDaily,
  getPreviousDaily,
} from "../controllers/dailyController";

const dailyRouter = express.Router();

dailyRouter.route("/add").get(getNewDaily).post(postNewDaily);
dailyRouter.route("/edit").get(getEditDaily).post(postEditDaily);
dailyRouter.route("/:date").get(getPreviousDaily);
dailyRouter.route("/previous").get(getPreviousDaily);

export default dailyRouter;
