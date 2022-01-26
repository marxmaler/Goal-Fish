import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth";
import { googleAuth } from "./controllers/userController";
import { localsMiddleware } from "../middlewares";
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

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);
//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(
  new GoogleStrategy.OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/user/auth/google/finish`,
    },
    googleAuth
  )
);

app.use(localsMiddleware); //session middleware 다음에 나와야 localsMiddleware 내에서 session 객체 조작 가능.
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
