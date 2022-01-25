import { async } from "regenerator-runtime";
import User from "../models/User";

export const getJoin = (req, res) => {
  const pageTitle = "Join";
  return res.render("join", { pageTitle });
};
export const postJoin = async (req, res) => {
  const { username, email, password, usernameValidation, emailValidation } =
    req.body;
  if (!usernameValidation || !emailValidation) {
    return res.render("join", {
      pageTitle: "Join",
      errorMessage: "아이디 및 이메일 중복 검사를 먼저 진행해주세요.",
    });
  }

  await User.create({
    username,
    email,
    password,
  });
  return res.redirect("/login");
};
export const getLogin = (req, res) => {
  return res.end();
};
export const postLogin = (req, res) => {
  return res.end();
};

export const checkUsername = async (req, res) => {
  const { username } = req.body;
  const usernameExists = await User.exists({ username });
  if (usernameExists) {
    return res.status(200).send({ result: false });
  }
  return res.status(200).send({ result: true });
};
export const checkEmail = (req, res) => {
  return res.end();
};
