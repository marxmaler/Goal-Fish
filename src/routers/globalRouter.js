import express from "express";
import { getDailyHome } from "../controllers/dailyController";

const globalRouter = express.Router();
globalRouter.route("/").get(getDailyHome);

export default globalRouter;
