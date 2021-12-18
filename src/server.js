import "dotenv/config";
import "./db";
import "./models/Daily";
import "./models/DailySub";
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import dailyRouter from "./routers/dailyRouter";

const app = express();
const PORT = 4000;

//뷰 엔진 설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

//전역 middleware 선언부
app.use(morgan("dev"));
app.use(express.urlencoded({extended: true}));

//router 선언부
app.use("/", globalRouter);
app.use("/daily", dailyRouter);

//server에게 특정 포트로 들어오는 request를 listen하라고 명령하는 부분(마지막에 와야 함)
const handleListening = () => console.log(`Your server is listening to requests on http://localhost:${PORT}`)
app.listen(PORT, handleListening);