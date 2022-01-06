import express from "express";
import { postHome } from "../controllers/dailyController";

const apiRouter = express.Router();

apiRouter.route("/home/checkbox/:id").post(postHome);

export default apiRouter;
