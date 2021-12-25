import express from "express";
import { getHome, postHome } from "../controllers/globalController";

const globalRouter = express.Router();
globalRouter.route("/").get(getHome).post(postHome);

export default globalRouter;