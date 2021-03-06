import express from "express";
import {
  postDailyCompleted,
  postDailyMeasure,
} from "../controllers/dailyController";
import {
  postWeeklyCompleted,
  postWeeklyMeasure,
} from "../controllers/weeklyController";
import {
  postMonthlyCompleted,
  postMonthlyMeasure,
} from "../controllers/monthlyController";
import {
  postYearlyCompleted,
  postYearlyMeasure,
} from "../controllers/yearlyController";
import {
  postSetLanguage,
  postUpdateSession,
} from "../controllers/userController";
import { postSetTimeDiff } from "../controllers/timeController";

const apiRouter = express.Router();

apiRouter.route("/daily/checkbox/:id").post(postDailyCompleted);
apiRouter.route("/daily/measure/:id").post(postDailyMeasure);
apiRouter.route("/weekly/checkbox/:id").post(postWeeklyCompleted);
apiRouter.route("/weekly/measure/:id").post(postWeeklyMeasure);
apiRouter.route("/monthly/checkbox/:id").post(postMonthlyCompleted);
apiRouter.route("/monthly/measure/:id").post(postMonthlyMeasure);
apiRouter.route("/yearly/checkbox/:id").post(postYearlyCompleted);
apiRouter.route("/yearly/measure/:id").post(postYearlyMeasure);
apiRouter.route("/language/:lang").post(postSetLanguage);
apiRouter.route("/time/:diff").post(postSetTimeDiff);
apiRouter.route("/session/:lang/:timeDiff").post(postUpdateSession);

export default apiRouter;
