import express from "express";
import { getEditDaily, getNewDaily, postEditDaily, postNewDaily, getPreviousDaily, postPreviousDaily } from "../controllers/dailyController";

const dailyRouter = express.Router();

dailyRouter.route("/add").get(getNewDaily).post(postNewDaily);
dailyRouter.route("/edit").get(getEditDaily).post(postEditDaily);
dailyRouter.route("/:date").get(getPreviousDaily).post(postPreviousDaily);

export default dailyRouter;