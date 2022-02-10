import Yearly from "../models/Yearly";
import YearlySub from "../models/YearlySub";
import { getToday, getAYearFromToday, yyyymmdd } from "../functions/time";
import User from "../models/User";
import { convertImp } from "../functions/convertImp";

export const getYearlyHome = async (req, res) => {
  const pageTitle = "Yearly";
  const today = getToday();
  const userId = req.session.user._id;
  const goal = await Yearly.findOne({
    owner: userId,
    termStart: { $lte: new Date(today) }, //termStart가 오늘과 같거나 앞에 있고 yearly를 찾습니다.
    termEnd: { $gte: new Date(today) }, //termEnd가 오늘과 같거나 나중에 있는 yearly를 찾습니다.
  })?.populate("subs");

  const user = await User.findById(userId);

  if (goal && goal.subs.length < 1) {
    user.yearlies.splice(user.yearlies.indexOf(goal._id), 1);
    user.save();
    req.session.user = user;

    await Yearly.deleteOne({
      _id: goal._id,
    });
    return res.redirect("/yearly/");
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
    user.yearlies.length > 1
      ? (user.totals.daily - todayTotal) / (user.yearlies.length - 1)
      : 0;

  let termStart = "";
  let termEnd = "";
  if (goal) {
    termStart = yyyymmdd(goal.termStart);
    termEnd = yyyymmdd(goal.termEnd);
  }

  return res.render("currentGoal", {
    goal,
    termStart,
    termEnd,
    pageTitle,
    goalAvg,
  });
};

export const getNewYearly = async (req, res) => {
  const pageTitle = "New Yearly";
  const userId = req.session.user._id;
  const lastYearly = await Yearly.findOne({ owner: userId })
    .sort({ date: -1 })
    .populate("subs");
  const unfinishedSubs = [];
  if (lastYearly) {
    for (let i = 0; i < lastYearly.subs.length; i++) {
      if (!lastYearly.subs[i].completed) {
        unfinishedSubs.push(lastYearly.subs[i]);
      }
    }
  }
  return res.render("newGoal", {
    today: getToday(),
    aYearFromToday: getAYearFromToday(),
    unfinishedSubs,
    pageTitle,
  });
};

export const postNewYearly = async (req, res) => {
  const { date } = req.body;
  const userId = req.session.user._id;
  //해당 날짜에 대해 이미 생성된 일일 목표가 있는지 중복 체크
  const pageTitle = "New Yearly";
  const today = getToday();
  const dateExists = await Yearly.exists({
    termStart: { $lte: new Date(date) },
    termEnd: { $gte: new Date(date) },
  });
  if (dateExists) {
    return res.render("newGoal", {
      today,
      errorMessage: "동일한 날짜에 대해 이미 설정된 연간 목표가 존재합니다.",
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

  //날짜 설정
  const termStart = new Date(date);
  const termEnd = new Date(date);
  termEnd.setDate(termEnd.getDate() + 364);

  const newYearly = await Yearly.create({
    owner: userId,
    termStart,
    termEnd,
  });

  const user = await User.findById(req.session.user._id);
  user.yearlies.push(newYearly._id);
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
          const sub = await YearlySub.create({
            yearly: newYearly._id,
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
          const sub = await YearlySub.create({
            yearly: newYearly._id,
            importance: importances[i],
            content: subs[i],
          });
          subIds.push(sub._id);
        }
      } else if (typeof useMeasures === "string") {
        //useMeasures가 문자열일 때
        if (useMeasures === `${i}`) {
          //이 sub가 단위를 사용한다면
          const sub = await YearlySub.create({
            yearly: newYearly._id,
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
          const sub = await YearlySub.create({
            yearly: newYearly._id,
            importance: importances[i],
            content: subs[i],
          });
          subIds.push(sub._id);
        }
      } else {
        //useMeasures가 undefine, measurement 쓰는 sub 없음
        const sub = await YearlySub.create({
          yearly: newYearly._id,
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
      const sub = await YearlySub.create({
        yearly: newYearly._id,
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
      const sub = await YearlySub.create({
        yearly: newYearly._id,
        importance: importances,
        content: subs,
      });
      subIds.push(sub._id);
    }
  }
  newYearly.subs = subIds;
  await newYearly.save();
  return res.redirect("/yearly/");
};

export const getEditYearly = async (req, res) => {
  const pageTitle = "Edit Yearly";
  const userId = req.session.user._id;
  const today = getToday();
  const goal = await Yearly.findOne({
    owner: userId,
    termStart: { $lte: new Date(today) }, //termStart가 오늘과 같거나 앞에 있고 yearly를 찾습니다.
    termEnd: { $gte: new Date(today) }, //termEnd가 오늘과 같거나 나중에 있는 yearly를 찾습니다.
  }).populate("subs");

  if (!goal) {
    //편집 중에 자정이 지났을 때 새로고침으로 발생할 수 있는 에러 방지
    return res.redirect("/");
  }
  const termStart = yyyymmdd(goal.termStart);
  const termEnd = yyyymmdd(goal.termEnd);

  return res.render("edit-goal", {
    goal,
    pageTitle,
    termStart,
    termEnd,
  });
};

export const postEditYearly = async (req, res) => {
  const {
    termStart,
    deletedSubs,
    subs,
    importances,
    useMeasures,
    measureNames,
    targetValues,
    eachAsIndepend,
  } = req.body;
  const rest = Object.keys(req.body); //기존 sub 정보
  rest.splice(rest.indexOf("termStart"), 1);
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

  const today = getToday();
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  const yearly = await Yearly.findOne({
    owner: userId,
    termStart: { $lte: new Date(today) }, //termStart가 오늘과 같거나 앞에 있고 yearly를 찾습니다.
    termEnd: { $gte: new Date(today) }, //termEnd가 오늘과 같거나 나중에 있는 yearly를 찾습니다.
  });
  //sub 삭제
  if (deletedSubs) {
    if (typeof deletedSubs === "string") {
      const deletedSub = await YearlySub.findByIdAndDelete(deletedSubs);
      const impPoint = convertImp(deletedSub.importance);
      deletedSub.eachAsIndepend
        ? (user.totals.yearly -= impPoint * deletedSub.currentValue)
        : deletedSub.completed
        ? (user.totals.yearly -= impPoint)
        : null;
      user.save();
      req.session.user = user;
    } else {
      for (let i = 0; i < deletedSubs.length; i++) {
        const deletedSub = await YearlySub.findByIdAndDelete(deletedSubs[i]);
        const impPoint = convertImp(deletedSub.importance);
        deletedSub.eachAsIndepend
          ? (user.totals.yearly -= impPoint * deletedSub.currentValue)
          : deletedSub.completed
          ? (user.totals.yearly -= impPoint)
          : null;
        user.save();
        req.session.user = user;
      }
    }
  }

  //기존 sub 내용 변경
  for (let i = 0; i < rest.length; i++) {
    const id = rest[i];
    const body = req.body[id];
    body[2] === "on" && !isNaN(parseInt(body[4]))
      ? await YearlySub.findByIdAndUpdate(id, {
          importance: body[0],
          content: body[1],
          useMeasure: true,
          measureName: body[3],
          targetValue: parseInt(body[4], 10),
          eachAsIndepend: body[5] ? true : false,
        })
      : await YearlySub.findByIdAndUpdate(id, {
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
      const newSub = await YearlySub.create({
        yearly: yearly._id,
        content: subs,
        importance: importances,
        measureName: measureNames ? measureNames : "",
        useMeasure: useMeasures ? true : false,
        targetValue: targetValues ? targetValues : 1,
        eachAsIndepend: eachAsIndepend ? true : false,
      });
      yearly.subs.push(newSub._id);
    } else {
      for (let i = 0; i < subs.length; i++) {
        if (typeof useMeasures !== "string") {
          const newSub = await YearlySub.create({
            yearly: yearly._id,
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
          yearly.subs.push(newSub._id);
        } else {
          const newSub = await YearlySub.create({
            yearly: yearly._id,
            content: subs[i],
            importance: importances[i],
            useMeasure: useMeasures === String(i) ? true : false,
            measureName: useMeasures === String(i) ? measureNames : "",
            targetValue: useMeasures === String(i) ? targetValues : 1,
            eachAsIndepend: useMeasures === String(i) ? eachAsIndepend : false,
          });
          yearly.subs.push(newSub._id);
        }
      }
    }
  }

  //yearly 날짜 변경(✔️)
  const termStartDate = new Date(termStart);
  const termEndDate = new Date(termStart);
  yearly.termStart = termStartDate;
  termEndDate.setDate(termStartDate.getDate() + 364);
  yearly.termEnd = termEndDate;
  yearly.save();
  return res.redirect("/yearly/");
};

export const getPreviousYearly = async (req, res) => {
  const pageTitle = "Previous Yearly";
  const today = getToday();
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  let goal = null;
  let termStart = "";
  let termEnd = "";

  if (req.originalUrl === "/yearly/previous/") {
    goal = await Yearly.findOne({
      owner: userId,
      termEnd: { $lt: new Date(today) },
    })
      .sort({ date: -1 })
      .populate("subs");

    if (goal) {
      termStart = yyyymmdd(goal.termStart);
      termEnd = yyyymmdd(goal.termEnd);
      termStart = termStart.split("-");
      termStart =
        termStart[0] + "년 " + termStart[1] + "월 " + termStart[2] + "일";
      termEnd = termEnd.split("-");
      termEnd = termEnd[0] + "년 " + termEnd[1] + "월 " + termEnd[2] + "일";
    }
  } else {
    let date = req.params.date;

    const currentGoal = await Yearly.findOne({
      owner: userId,
      termStart: { $lte: new Date(today) }, //termStart가 오늘과 같거나 앞에 있고 yearly를 찾습니다.
      termEnd: { $gte: new Date(today) }, //termEnd가 오늘과 같거나 나중에 있는 yearly를 찾습니다.
    });
    if (
      new Date(date) >= currentGoal.termStart &&
      new Date(date) <= currentGoal.termEnd
    ) {
      return res.redirect("/yearly/");
    }

    goal = await Yearly.findOne({
      owner: userId,
      termStart: { $lte: new Date(date) }, //termStart가 오늘과 같거나 앞에 있고 yearly를 찾습니다.
      termEnd: { $gte: new Date(date) }, //termEnd가 오늘과 같거나 나중에 있는 yearly를 찾습니다.
    }).populate("subs");
    termStart = yyyymmdd(goal.termStart);
    termEnd = yyyymmdd(goal.termEnd);
  }

  //성취도 계산
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
    user.yearlies.length > 1
      ? (user.totals.yearly - todayTotal) / (user.yearlies.length - 1)
      : 0;
  return res.render("previousGoal", {
    goal,
    termStart,
    termEnd,
    pageTitle,
    goalAvg,
  });
};

export const postYearlyCompleted = async (req, res) => {
  const { id } = req.params;
  const yearlySub = await YearlySub.findById(id);
  if (yearlySub.completed) {
    yearlySub.completed = false;
    yearlySub.save();
    if (!yearlySub.eachAsIndepend) {
      const impPoint =
        yearlySub.importance === "A" ? 5 : yearlySub.importance === "B" ? 3 : 1;
      const userId = req.session.user._id;
      const user = await User.findById(userId);
      user.totals.yearly -= impPoint;
      user.save();
      req.session.user = user;
    }
  } else {
    yearlySub.completed = true;
    yearlySub.save();
    if (!yearlySub.eachAsIndepend) {
      const impPoint =
        yearlySub.importance === "A" ? 5 : yearlySub.importance === "B" ? 3 : 1;
      const userId = req.session.user._id;
      const user = await User.findById(userId);
      user.totals.yearly += impPoint;
      user.save();
      req.session.user = user;
    }
  }

  return res.sendStatus(200);
};

export const postYearlyMeasure = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const yearlySub = await YearlySub.findById(id);
  if (value > yearlySub.targetValue) {
    return res.sendStatus(200);
  } else {
    if (
      yearlySub.eachAsIndepend &&
      parseInt(yearlySub.currentValue, 10) !== parseInt(value, 10)
    ) {
      const impPoint =
        yearlySub.importance === "A" ? 5 : yearlySub.importance === "B" ? 3 : 1;
      const userId = req.session.user._id;
      const user = await User.findById(userId);
      parseInt(yearlySub.currentValue, 10) < parseInt(value, 10)
        ? (user.totals.yearly += impPoint)
        : (user.totals.yearly -= impPoint);
      user.save();
      req.session.user = user;
    }
    yearlySub.currentValue = value;
    yearlySub.save();
    return res.sendStatus(200);
  }
};
