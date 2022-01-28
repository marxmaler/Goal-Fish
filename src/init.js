import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Daily";
import "./models/DailySub";
import "./models/Weekly";
import "./models/WeeklySub";
import "./models/Monthly";
import "./models/MonthlySub";
import "./models/Yearly";
import "./models/YearlySub";
import "./models/User";
import app from "./server";

//server에게 특정 포트로 들어오는 request를 listen하라고 명령하는 부분(마지막에 와야 함)
const handleListening = () =>
  console.log(
    `Your server is listening to requests on http://localhost:${process.env.PORT}`
  );
app.listen(process.env.PORT, handleListening);
