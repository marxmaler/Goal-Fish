import express from "express";
import { protectorMiddleware } from "../middlewares";
import {
  getMonthlyHome,
  getEditMonthly,
  getNewMonthly,
  postEditMonthly,
  postNewMonthly,
  getPreviousMonthly,
} from "../controllers/monthlyController";

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
monthlyRouter
  .route("/previous")
  .all(protectorMiddleware)
  .get(getPreviousMonthly);
monthlyRouter.route("/:id").all(protectorMiddleware).get(getPreviousMonthly);
export default monthlyRouter;
