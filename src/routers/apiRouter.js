import express from "express";
import { postCompleted, postMeasure } from "../controllers/dailyController";

const apiRouter = express.Router();

apiRouter.route("/daily/checkbox/:id").post(postCompleted);
apiRouter.route("/daily/measure/:id").post(postMeasure);

export default apiRouter;
