import express from "express";
import {
  getMonthlyHome,
  getEditMonthly,
  getNewMonthly,
  postEditMonthly,
  postNewMonthly,
  getPreviousMonthly,
} from "../controllers/monthlyController";

const monthlyRouter = express.Router();

monthlyRouter.route("/").get(getMonthlyHome);
monthlyRouter.route("/add").get(getNewMonthly).post(postNewMonthly);
monthlyRouter.route("/edit").get(getEditMonthly).post(postEditMonthly);
monthlyRouter.route("/:id").get(getPreviousMonthly);
monthlyRouter.route("/previous").get(getPreviousMonthly);
export default monthlyRouter;
