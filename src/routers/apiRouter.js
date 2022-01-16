import express from "express";
import { postCompleted, postMeasure } from "../controllers/dailyController";

const apiRouter = express.Router();

apiRouter.route("/home/checkbox/:id").post(postCompleted);
apiRouter.route("/home/measure/:id").post(postMeasure);

export default apiRouter;
