import express from "express";
import { protectorMiddleware } from "../../middlewares";
import {
  getEditDaily,
  getNewDaily,
  postEditDaily,
  postNewDaily,
  getPreviousDaily,
} from "../controllers/dailyController";

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
dailyRouter.route("/previous").all(protectorMiddleware).get(getPreviousDaily);
dailyRouter.route("/:date").all(protectorMiddleware).get(getPreviousDaily);

export default dailyRouter;
