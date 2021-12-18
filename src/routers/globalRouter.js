import express from "express";
import { getHome, postHome } from "../controllers/dailyController";

const globalRouter = express.Router();
globalRouter.route("/").get(getHome).post(postHome);

export default globalRouter;