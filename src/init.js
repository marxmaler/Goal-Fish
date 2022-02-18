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
const handleListening = () => {
  const isHeroku = process.env.NODE_ENV === "production";

  console.log(
    isHeroku
      ? `Your server is listening to requests on https://goal-manager220213.herokuapp.com:${process.env.PORT}/`
      : `Your server is listening to requests on http://localhost:${process.env.PORT}`
  );
};
app.listen(process.env.PORT, handleListening);

export const isHeroku = process.env.NODE_ENV === "production";
