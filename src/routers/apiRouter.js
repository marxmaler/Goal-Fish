import express from "express";
import {
  postDailyCompleted,
  postDailyMeasure,
} from "../controllers/dailyController";
import {
  postWeeklyCompleted,
  postWeeklyMeasure,
} from "../controllers/weeklyController";

const apiRouter = express.Router();

apiRouter.route("/daily/checkbox/:id").post(postDailyCompleted);
apiRouter.route("/daily/measure/:id").post(postDailyMeasure);
apiRouter.route("/weekly/checkbox/:id").post(postWeeklyCompleted);
apiRouter.route("/weekly/measure/:id").post(postWeeklyMeasure);

export default apiRouter;
