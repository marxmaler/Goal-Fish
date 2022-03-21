import express from "express";
import { protectorMiddleware } from "../middlewares";
import {
  getYearlyHome,
  getEditYearly,
  getNewYearly,
  postEditYearly,
  postNewYearly,
} from "../controllers/yearlyController";
import { getPreviousGoal } from "../controllers/goalController";

const yearlyRouter = express.Router();

yearlyRouter.route("/").all(protectorMiddleware).get(getYearlyHome);
yearlyRouter
  .route("/add")
  .all(protectorMiddleware)
  .get(getNewYearly)
  .post(postNewYearly);
yearlyRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEditYearly)
  .post(postEditYearly);
yearlyRouter.route("/previous/").all(protectorMiddleware).get(getPreviousGoal);
yearlyRouter
  .route("/previous/:id")
  .all(protectorMiddleware)
  .get(getPreviousGoal);
export default yearlyRouter;
