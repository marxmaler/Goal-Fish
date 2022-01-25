import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import dailyRouter from "./routers/dailyRouter";
import weeklyRouter from "./routers/weeklyRouter";
import monthlyRouter from "./routers/monthlyRouter";
import yearlyRouter from "./routers/yearlyRouter";
import apiRouter from "./routers/apiRouter";
import userRouter from "./routers/userRouter";

const app = express();

//뷰 엔진 설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

//전역 middleware 선언부
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//router 선언부
app.use("/", globalRouter);
app.use("/daily", dailyRouter);
app.use("/weekly", weeklyRouter);
app.use("/monthly", monthlyRouter);
app.use("/yearly", yearlyRouter);
app.use("/user", userRouter);
app.use("/api", apiRouter);

//static files serving
app.use("/assets", express.static("assets"));

export default app;
