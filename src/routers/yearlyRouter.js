import express from "express";
import { protectorMiddleware } from "../middlewares";
import {
  getYearlyHome,
  getEditYearly,
  getNewYearly,
  postEditYearly,
  postNewYearly,
  getPreviousYearly,
} from "../controllers/yearlyController";

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
yearlyRouter.route("/previous").all(protectorMiddleware).get(getPreviousYearly);
yearlyRouter.route("/:id").all(protectorMiddleware).get(getPreviousYearly);
export default yearlyRouter;
