import express from "express";
import { getHome } from "../controllers/dailyController";

const globalRouter = express.Router();
globalRouter.route("/").get(getHome);

export default globalRouter;
