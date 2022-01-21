import express from "express";
import {
  getYearlyHome,
  getEditYearly,
  getNewYearly,
  postEditYearly,
  postNewYearly,
  getPreviousYearly,
} from "../controllers/yearlyController";

const yearlyRouter = express.Router();

yearlyRouter.route("/").get(getYearlyHome);
yearlyRouter.route("/add").get(getNewYearly).post(postNewYearly);
yearlyRouter.route("/edit").get(getEditYearly).post(postEditYearly);
yearlyRouter.route("/:id").get(getPreviousYearly);
yearlyRouter.route("/previous").get(getPreviousYearly);
export default yearlyRouter;
