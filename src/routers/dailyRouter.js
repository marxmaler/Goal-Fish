import express from "express";
import { getEditDaily, getNewDaily, postEditDaily, postNewDaily, getDeleteDailySub, postDeleteDailySub } from "../controllers/dailyController";

const dailyRouter = express.Router();

dailyRouter.route("/add").get(getNewDaily).post(postNewDaily);
dailyRouter.route("/edit").get(getEditDaily).post(postEditDaily);
dailyRouter.route("/sub/delete/:id").get(getDeleteDailySub).post(postDeleteDailySub);

export default dailyRouter;