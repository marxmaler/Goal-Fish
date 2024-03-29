export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user;
  res.locals.impArray = ["A", "B", "C"];
  res.locals.measureNameArray =
    req.session.lang === "ko"
      ? [
          "시간",
          "일",
          "회",
          "개",
          "쪽",
          "권",
          "걸음",
          "가지",
          "km",
          "hours",
          "days",
          "times",
          "pages",
          "books",
          "steps",
          "miles",
          "kinds",
        ]
      : [
          "hours",
          "days",
          "times",
          "pages",
          "books",
          "steps",
          "kinds",
          "miles",
          "km",
          "시간",
          "일",
          "회",
          "개",
          "쪽",
          "권",
          "걸음",
          "가지",
        ];
  res.locals.langArr = ["ko", "en"];
  res.locals.lang = req.session.lang ?? req.session.passport?.lang;
  res.locals.timeDiff = req.session.timeDiff;
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
};
