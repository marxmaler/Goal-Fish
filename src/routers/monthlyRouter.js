import express from "express";
import { protectorMiddleware } from "../middlewares";
import {
  getMonthlyHome,
  getEditMonthly,
  getNewMonthly,
  postEditMonthly,
  postNewMonthly,
} from "../controllers/monthlyController";
import { getPreviousGoal } from "../controllers/goalController";

const monthlyRouter = express.Router();

monthlyRouter.route("/").all(protectorMiddleware).get(getMonthlyHome);
monthlyRouter
  .route("/add")
  .all(protectorMiddleware)
  .get(getNewMonthly)
  .post(postNewMonthly);
monthlyRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEditMonthly)
  .post(postEditMonthly);
monthlyRouter.route("/previous/").all(protectorMiddleware).get(getPreviousGoal);
monthlyRouter
  .route("/previous/:id")
  .all(protectorMiddleware)
  .get(getPreviousGoal);
export default monthlyRouter;
