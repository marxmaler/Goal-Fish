import express from "express";
import { getEditDaily, getNewDaily, postEditDaily, postNewDaily } from "../controllers/dailyController";

const dailyRouter = express.Router();

dailyRouter.route("/add").get(getNewDaily).post(postNewDaily);
dailyRouter.route("/edit").get(getEditDaily).post(postEditDaily);

export default dailyRouter;