import { async } from "regenerator-runtime";
import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import passport from "passport";
import e from "express";
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
// const KakaoStrategy = require("passport-kakao").Strategy;
// const NaverStrategy = require("passport-naver").Strategy;

const isHeroku = process.env.NODE_ENV === "production";

export const getJoin = (req, res) => {
  const pageTitle = "Join";
  return res.render("join", { pageTitle });
};
export const postJoin = async (req, res) => {
  const { name, email, emailValidation, password, passwordConfirm } = req.body;
  const lang = req.session.lang;
  if (!emailValidation) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage:
        lang === "ko"
          ? "이메일 검사를 먼저 진행해주세요."
          : "Please run email-check first",
    });
  }
  if (password !== passwordConfirm) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage:
        lang === "ko"
          ? "비밀번호가 일치하지 않습니다."
          : "Passwords do not match.",
    });
  }

  await User.create({
    name,
    email,
    password,
  });
  return res.status(200).redirect("/login");
};
export const getLogin = (req, res) => {
  const pageTitle = "Login";
  return res.render("login", { pageTitle });
};
export const postLogin = async (req, res) => {
  const pageTitle = "Login";
  const { email, password } = req.body;
  const lang = req.session.lang;
  const user = await User.findOne({ email, socialOnly: false });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage:
        lang === "ko"
          ? "등록되지 않은 이메일입니다."
          : "The email is not registered.",
    });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage:
        lang === "ko"
          ? "비밀번호가 일치하지 않습니다."
          : "Passwords do not match.",
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;
  return res.status(200).redirect("/");
};

export const checkEmail = async (req, res) => {
  const { email } = req.body;
  const emailExists = await User.exists({ email });
  if (emailExists) {
    return res.status(200).send({ result: false });
  }
  return res.status(200).send({ result: true });
};

export const logout = (req, res) => {
  const lang = req.session.lang;
  const timeDiff = req.session.timeDiff;
  req.session.destroy();
  const pageTitle = "Login";
  return res.render("login", {
    pageTitle,
    prevLang: lang,
    prevTimeDiff: timeDiff,
  });
};

export const getQuote = (req, res) => {
  const pageTitle = "Quote";
  return res.render("quote", { pageTitle });
};

export const postQuote = async (req, res) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  user.quote = req.body.quote;
  req.session.user = user;
  user.save();
  return res.redirect("/");
};

export const getProfile = (req, res) => {
  const pageTitle = "Profile";
  return res.render("profile", { pageTitle });
};

export const postProfile = async (req, res) => {
  const userId = req.session.user._id;
  const { name, lang } = req.body;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      name,
      lang,
    },
    { new: true }
  );
  req.session.user = user;
  req.session.lang = user.lang;
  return res.redirect("/");
};

//깃허브로 가입/로그인
export const startGithubAuth = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    scope: "read:user user:email",
    allow_signup: false,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const finishGithubAuth = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenData = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenData) {
    const { access_token } = tokenData;
    const apiUrl = "https://api.github.com/user";
    const userData = await (
      await fetch(apiUrl, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        email: emailObj.email,
        name: userData.name,
        password: "",
        joinedWithSocial: true,
        lang: req.session.lang,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

//구글로 가입/로그인
export const googleAuth = async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ email: profile.emails[0].value });
  if (!user) {
    user = await User.create({
      email: profile.emails[0].value,
      name: profile.displayName,
      joinedWithSocial: true,
      lang: profile.locale,
    });
  }
  return done(null, user);
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: isHeroku
        ? `https://goal-fish.herokuapp.com/user/auth/google/finish`
        : `http://localhost:${process.env.PORT}/user/auth/google/finish`,
    },
    googleAuth
  )
);

// //카카오로 가입/로그인
// export const kakaoAuth = async (accessToken, refreshToken, profile, done) => {
//   const email = profile._json.kakao_account.email;
//   if (!email) {
//     //이메일이 없으면(아직 테스트 안해봄, 친구한테 부탁해서 이메일 선택 제공 안하면 profile에 뭐가 나오는지 일단 보고 처리하기)
//     console.log(profile);
//     return done(null, null);
//   }
//   const name = profile.displayName;
//   let user = await User.findOne({ email });
//   if (user) {
//     user.name = name;
//     user.save();
//   } else {
//     user = await User.create({
//       email,
//       name,
//       joinedWithSocial: true,
//     });
//   }
//   return done(null, user);
// };

// passport.use(
//   "kakao-login",
//   new KakaoStrategy(
//     {
//       clientID: process.env.KAKAO_CLIENT,
//       clientSecret: process.env.KAKAO_SECRET,
//       callbackURL: `http://localhost:${process.env.PORT}/user/auth/kakao/finish`,
//     },
//     kakaoAuth
//   )
// );

// // 네이버로 가입/로그인
// export const naverAuth = async (accessToken, refreshToken, profile, done) => {
//   const email = profile.emails[0].value;
//   const name = profile.displayName;
//   let user = await User.findOne({ email });
//   if (user) {
//     user.name = name;
//     user.save();
//   } else {
//     user = await User.create({
//       email,
//       name,
//       joinedWithSocial: true,
//     });
//   }
//   return done(null, user);
// };

// passport.use(
//   "naver",
//   new NaverStrategy(
//     {
//       clientID: process.env.NAVER_CLIENT,
//       clientSecret: process.env.NAVER_SECRET,
//       callbackURL: `http://localhost:${process.env.PORT}/user/auth/naver/finish`,
//     },
//     naverAuth
//   )
// );

export const postSetLanguage = (req, res) => {
  let langChange = false;
  if (!req.session.lang) {
    if (req.session.user || req.session.passport?.user) {
      req.session.lang =
        req.session.user?.lang ?? req.session.passport?.user?.lang;
      req.session.lang === "ko" && (langChange = true);
    } else {
      req.session.lang = req.params.lang;
      req.session.lang === "ko" && (langChange = true);
    }
  }

  return res.status(200).send({ langChange, sessionLang: req.session.lang });
};

export const postUpdateSession = (req, res) => {
  const { lang, timeDiff } = req.params;
  req.session.lang = req.session.lang ?? lang;
  req.session.timeDiff = req.session.timeDiff ?? timeDiff;
  return res.sendStatus(200);
};
