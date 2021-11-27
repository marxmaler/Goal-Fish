import express from "express";
import morgan from "morgan";

const app = express();
const PORT = 4000;

//뷰 엔진 설정
app.set("view engine", "pug");

//전역 middleware 선언부
app.use(morgan("dev"));

//request 처리부
const handleHome = (req, res) => {
    return res.send("<h1>This is the root page.</h1>")
}
app.get("/", handleHome)

//server에게 특정 포트로 들어오는 request를 listen하라고 명령하는 부분(마지막에 와야 함)
const handleListening = () => console.log(`Your server is listening to requests on http://localhost:${PORT}`)
app.listen(PORT, handleListening);