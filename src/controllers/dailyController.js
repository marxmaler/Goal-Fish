import Daily from "../models/Daily";
import DailySub from "../models/DailySub";
import { getToday, yyyymmdd } from "../functions/time";
import User from "../models/User";
import { convertImp } from "../functions/convertImp";

export const getDailyHome = async (req, res) => {
  const pageTitle = "Daily";
  const date = getToday();
  const userId = req.session.user._id;
  const goal = await Daily.findOne({
    owner: userId,
    date,
  }).populate("subs");

  const user = await User.findById(userId);

  if (goal && goal.subs.length < 1) {
    await DailySub.deleteMany({
      daily: goal._id,
    });

    user.dailies.splice(user.dailies.indexOf(goal._id), 1);
    user.save();
    req.session.user = user;

    await Daily.deleteOne({
      _id: goal._id,
    });
    return res.redirect("/");
  }

  //오늘의 성취도 계산
  const subs = goal?.subs;
  let todayTotal = 0;
  if (subs) {
    subs.forEach((sub) => {
      sub.eachAsIndepend
        ? (todayTotal += convertImp(sub.importance) * sub.currentValue)
        : sub.completed
        ? (todayTotal += convertImp(sub.importance))
        : null;
    });
  }
  let goalAvg =
    user.dailies.length > 1
      ? (user.totals.daily - todayTotal) / (user.dailies.length - 1)
      : 0;
  return res.render("currentGoal", {
    goal,
    date,
    pageTitle,
    goalAvg,
    todayTotal,
  });
};

export const postDailyCompleted = async (req, res) => {
  const { id } = req.params;
  const dailySub = await DailySub.findById(id);
  if (dailySub.completed) {
    dailySub.completed = false;
    dailySub.save();
    if (!dailySub.eachAsIndepend) {
      const impPoint =
        dailySub.importance === "A" ? 5 : dailySub.importance === "B" ? 3 : 1;
      const userId = req.session.user._id;
      const user = await User.findById(userId);
      user.totals.daily -= impPoint;
      user.save();
      req.session.user = user;
    }
  } else {
    dailySub.completed = true;
    dailySub.save();
    if (!dailySub.eachAsIndepend) {
      const impPoint =
        dailySub.importance === "A" ? 5 : dailySub.importance === "B" ? 3 : 1;
      const userId = req.session.user._id;
      const user = await User.findById(userId);
      user.totals.daily += impPoint;
      user.save();
      req.session.user = user;
    }
  }
  return res.sendStatus(200);
};

export const postDailyMeasure = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const dailySub = await DailySub.findById(id);
  if (value > dailySub.targetValue) {
    return res.sendStatus(400);
  } else {
    if (
      dailySub.eachAsIndepend &&
      parseInt(dailySub.currentValue, 10) !== parseInt(value, 10)
    ) {
      const impPoint =
        dailySub.importance === "A" ? 5 : dailySub.importance === "B" ? 3 : 1;
      const userId = req.session.user._id;
      const user = await User.findById(userId);
      parseInt(dailySub.currentValue, 10) < parseInt(value, 10)
        ? (user.totals.daily += impPoint)
        : (user.totals.daily -= impPoint);
      user.save();
      req.session.user = user;
    }
    dailySub.currentValue = value;
    dailySub.save();
    return res.sendStatus(200);
  }
};

export const getNewDaily = async (req, res) => {
  const pageTitle = "New Daily";
  const userId = req.session.user._id;
  const lastDaily = await Daily.findOne({ owner: userId })
    .sort({ date: -1 })
    .populate("subs");
  const unfinishedSubs = [];
  if (lastDaily) {
    for (let i = 0; i < lastDaily.subs.length; i++) {
      if (!lastDaily.subs[i].completed) {
        unfinishedSubs.push(lastDaily.subs[i]);
      }
    }
  }
  return res.render("newGoal", {
    today: getToday(),
    unfinishedSubs,
    pageTitle,
  });
};

export const postNewDaily = async (req, res) => {
  const { date } = req.body;
  const userId = req.session.user._id;
  //해당 날짜에 대해 이미 생성된 일일 목표가 있는지 중복 체크
  const dateExists = await Daily.exists({
    userId,
    date,
  });
  if (dateExists) {
    return res.render("newGoal", {
      today: getToday(),
      errorMessage: "동일한 날짜에 대해 이미 설정된 일일 목표가 존재합니다.",
      pageTitle,
    });
  }

  const {
    subs,
    importances,
    useMeasures,
    measureNames,
    targetValues,
    eachAsIndepend,
  } = req.body;
  const subIds = [];
  if (subs === undefined) {
    //subs가 없을 때
    return res.redirect("/");
  }
  const newDaily = await Daily.create({
    owner: userId,
    date,
  });

  const user = await User.findById(req.session.user._id);
  user.dailies.push(newDaily._id);
  user.save();
  req.session.user = user;

  if (typeof subs === "object") {
    //sub가 둘 이상
    for (let i = 0; i < subs.length; i++) {
      if (subs[i].replace(/ /gi, "").length < 1) {
        continue; //공백 목표 받지 않기
      }
      //measurement setting check
      if (typeof useMeasures === "object") {
        //useMeasures가 배열일 때
        if (useMeasures.includes(`${i}`)) {
          //이 sub가 단위를 사용한다면
          const sub = await DailySub.create({
            daily: newDaily._id,
            importance: importances[i],
            content: subs[i],
            useMeasure: true,
            measureName: String(measureNames.splice(0, 1)),
            targetValue: parseInt(targetValues.splice(0, 1), 10),
            eachAsIndepend:
              typeof eachAsIndepend === "string"
                ? parseInt(eachAsIndepend, 10) === i
                  ? true
                  : false
                : eachAsIndepend.includes(String(i))
                ? true
                : false,
          });
          subIds.push(sub._id);
        } else {
          //이 sub가 단위를 사용하지 않는다면
          const sub = await DailySub.create({
            daily: newDaily._id,
            importance: importances[i],
            content: subs[i],
          });
          subIds.push(sub._id);
        }
      } else if (typeof useMeasures === "string") {
        //useMeasures가 문자열일 때
        if (useMeasures === `${i}`) {
          //이 sub가 단위를 사용한다면
          const sub = await DailySub.create({
            daily: newDaily._id,
            importance: importances[i],
            content: subs[i],
            useMeasure: true,
            measureName: measureNames,
            targetValue: targetValues,
            eachAsIndepend: eachAsIndepend ? true : false,
          });
          subIds.push(sub._id);
        } else {
          //이 sub가 단위를 사용하지 않는다면
          const sub = await DailySub.create({
            daily: newDaily._id,
            importance: importances[i],
            content: subs[i],
          });
          subIds.push(sub._id);
        }
      } else {
        //useMeasures가 undefine, measurement 쓰는 sub 없음
        const sub = await DailySub.create({
          daily: newDaily._id,
          importance: importances[i],
          content: subs[i],
        });
        subIds.push(sub._id);
      }
    }
  } else {
    //subs가 string
    if (subs.replace(/ /gi, "").length < 1) {
      return res.redirect("/");
    }
    if (typeof useMeasures === "string") {
      //measure를 쓴다면,
      const sub = await DailySub.create({
        daily: newDaily._id,
        importance: importances,
        content: subs,
        useMeasure: true,
        measureName: measureNames,
        targetValue: targetValues,
        eachAsIndepend: eachAsIndepend ? true : false,
      });
      subIds.push(sub._id);
    } else {
      //measure를 안쓴다면,
      const sub = await DailySub.create({
        daily: newDaily._id,
        importance: importances,
        content: subs,
      });
      subIds.push(sub._id);
    }
  }
  newDaily.subs = subIds;
  await newDaily.save();
  return res.redirect("/");
};

export const getEditDaily = async (req, res) => {
  const pageTitle = "Edit Daily";
  const userId = req.session.user._id;
  const goal = await Daily.findOne({
    owner: userId,
    date: getToday(),
  }).populate("subs");

  if (!goal) {
    //편집 중에 자정이 지났을 때 새로고침으로 발생할 수 있는 에러 방지
    return res.redirect("/");
  }

  return res.render("edit-goal", {
    goal,
    pageTitle,
  });
};

export const postEditDaily = async (req, res) => {
  const {
    deletedSubs,
    subs,
    importances,
    useMeasures,
    measureNames,
    targetValues,
    eachAsIndepend,
  } = req.body;
  const rest = Object.keys(req.body); //기존 sub 정보
  if (deletedSubs) {
    rest.splice(rest.indexOf("deletedSubs"), 1);
  }
  if (subs) {
    rest.splice(rest.indexOf("subs"), 1);
    rest.splice(rest.indexOf("importances"), 1);
    rest.splice(rest.indexOf("useMeasures"), 1);
    rest.splice(rest.indexOf("measureNames"), 1);
    rest.splice(rest.indexOf("targetValues"), 1);
    rest.splice(rest.indexOf("eachAsIndepend"), 1);
  }

  const userId = req.session.user._id;
  const daily = await Daily.findOne({
    owner: userId,
    date: getToday(),
  });
  //sub 삭제
  if (deletedSubs) {
    if (typeof deletedSubs === "string") {
      await DailySub.findByIdAndDelete(deletedSubs);
    } else {
      for (let i = 0; i < deletedSubs.length; i++) {
        await DailySub.findByIdAndDelete(deletedSubs[i]);
      }
    }
  }

  //기존 sub 내용 변경
  for (let i = 0; i < rest.length; i++) {
    const id = rest[i];
    const body = req.body[id];
    body[2] === "on" && !isNaN(parseInt(body[4]))
      ? await DailySub.findByIdAndUpdate(id, {
          importance: body[0],
          content: body[1],
          useMeasure: true,
          measureName: body[3],
          targetValue: parseInt(body[4], 10),
          eachAsIndepend: body[5] ? true : false,
        })
      : await DailySub.findByIdAndUpdate(id, {
          importance: body[0],
          content: body[1],
          useMeasure: false,
          measureName: "",
          currentValue: 0,
          targetValue: 1,
          eachAsIndepend: false,
        });
  }

  // 새 sub 생성
  if (subs) {
    if (typeof subs === "string" && subs.replace(/ /gi, "").length > 0) {
      const newSub = await DailySub.create({
        daily: daily._id,
        content: subs,
        importance: importances,
        measureName: measureNames ? measureNames : "",
        useMeasure: useMeasures ? true : false,
        targetValue: targetValues ? targetValues : 1,
        eachAsIndepend: eachAsIndepend ? true : false,
      });
      daily.subs.push(newSub._id);
    } else {
      for (let i = 0; i < subs.length; i++) {
        if (typeof useMeasures !== "string") {
          const newSub = await DailySub.create({
            daily: daily._id,
            content: subs[i],
            importance: importances[i],
            useMeasure: useMeasures?.includes(String(i)) ? true : false,
            measureName: useMeasures?.includes(String(i))
              ? measureNames.splice(0, 1)[0]
              : "",
            targetValue: useMeasures?.includes(String(i))
              ? targetValues.splice(0, 1)[0]
              : 1,
            eachAsIndepend: useMeasures?.includes(String(i))
              ? eachAsIndepend.splice(0, 1)[0]
              : false,
          });
          daily.subs.push(newSub._id);
        } else {
          const newSub = await DailySub.create({
            daily: daily._id,
            content: subs[i],
            importance: importances[i],
            useMeasure: useMeasures === String(i) ? true : false,
            measureName: useMeasures === String(i) ? measureNames : "",
            targetValue: useMeasures === String(i) ? targetValues : 1,
            eachAsIndepend: useMeasures === String(i) ? eachAsIndepend : false,
          });
          daily.subs.push(newSub._id);
        }
      }
    }
  }
  await daily.save();
  return res.redirect("/");
};

export const getPreviousDaily = async (req, res) => {
  const pageTitle = "Previous Daily";
  const today = getToday();
  const userId = req.session.user._id;
  if (req.originalUrl === "/daily/previous/") {
    const lastGoal = await Daily.findOne({
      owner: userId,
      date: { $lt: new Date(today) },
    })
      .sort({ date: -1 })
      .populate("subs");
    let date = "";
    if (lastGoal) {
      date = yyyymmdd(lastGoal.date);
      date = date.split("-");
      date = date[0] + "년 " + date[1] + "월 " + date[2] + "일";
    }
    return res.render("previousGoal", { lastGoal, date, pageTitle });
  }
  let date = req.params.date;
  if (date === today) {
    return res.redirect("/");
  }
  const goal = await Daily.findOne({ owner: userId, date }).populate("subs");
  date = date.split("-");
  date = date[0] + "년 " + date[1] + "월 " + date[2] + "일";
  return res.render("previousGoal", { goal, date, pageTitle });
};
