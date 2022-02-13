import Monthly from "../models/Monthly";
import MonthlySub from "../models/MonthlySub";
import { getToday, getAMonthFromToday, yyyymmdd } from "../functions/time";
import { convertImp } from "../functions/convertImp";

export const getMonthlyHome = async (req, res) => {
  const pageTitle = "Monthly";
  const today = getToday();
  const userId = req.session.user._id;
  const goal = await Monthly.findOne({
    owner: userId,
    termStart: { $lte: new Date(today) }, //termStart가 오늘과 같거나 앞에 있고 monthly를 찾습니다.
    termEnd: { $gte: new Date(today) }, //termEnd가 오늘과 같거나 나중에 있는 monthly를 찾습니다.
  })?.populate("subs");

  if (goal && goal.subs.length < 1) {
    await Monthly.deleteOne({
      _id: goal._id,
    });
    return res.redirect("/monthly/");
  }

  //평균 구하기
  const prevGoals = await Monthly.find({
    owner: userId,
    termEnd: { $lt: goal.termEnd },
  })
    .sort({ termEnd: -1 })
    .limit(3);
  let prevTotal = 0;
  let prevAvg = 0;
  prevGoals ? prevGoals.forEach((goal) => (prevTotal += goal.total)) : null;
  prevTotal !== 0 ? (prevAvg = prevTotal / prevGoals.length) : null;

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
    prevAvg,
  });
};

export const getNewMonthly = async (req, res) => {
  const pageTitle = "New Monthly";
  const userId = req.session.user._id;
  const lastMonthly = await Monthly.findOne({ owner: userId })
    .sort({ date: -1 })
    .populate("subs");
  const unfinishedSubs = [];
  if (lastMonthly) {
    for (let i = 0; i < lastMonthly.subs.length; i++) {
      if (!lastMonthly.subs[i].completed) {
        unfinishedSubs.push(lastMonthly.subs[i]);
      }
    }
  }
  return res.render("newGoal", {
    today: getToday(),
    aMonthFromToday: getAMonthFromToday(),
    unfinishedSubs,
    pageTitle,
  });
};

export const postNewMonthly = async (req, res) => {
  const { date } = req.body;
  const userId = req.session.user._id;
  //해당 날짜에 대해 이미 생성된 일일 목표가 있는지 중복 체크
  const pageTitle = "New Monthly";
  const today = getToday();
  const dateExists = await Monthly.exists({
    termStart: { $lte: new Date(date) },
    termEnd: { $gte: new Date(date) },
  });
  if (dateExists) {
    return res.render("newGoal", {
      today,
      errorMessage: "동일한 날짜에 대해 이미 설정된 월간 목표가 존재합니다.",
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
  termEnd.setDate(termEnd.getDate() + 29);

  const newMonthly = await Monthly.create({
    owner: userId,
    termStart,
    termEnd,
  });

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
          const sub = await MonthlySub.create({
            monthly: newMonthly._id,
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
          const sub = await MonthlySub.create({
            monthly: newMonthly._id,
            importance: importances[i],
            content: subs[i],
          });
          subIds.push(sub._id);
        }
      } else if (typeof useMeasures === "string") {
        //useMeasures가 문자열일 때
        if (useMeasures === `${i}`) {
          //이 sub가 단위를 사용한다면
          const sub = await MonthlySub.create({
            monthly: newMonthly._id,
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
          const sub = await MonthlySub.create({
            monthly: newMonthly._id,
            importance: importances[i],
            content: subs[i],
          });
          subIds.push(sub._id);
        }
      } else {
        //useMeasures가 undefine, measurement 쓰는 sub 없음
        const sub = await MonthlySub.create({
          monthly: newMonthly._id,
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
      const sub = await MonthlySub.create({
        monthly: newMonthly._id,
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
      const sub = await MonthlySub.create({
        monthly: newMonthly._id,
        importance: importances,
        content: subs,
      });
      subIds.push(sub._id);
    }
  }
  newMonthly.subs = subIds;
  await newMonthly.save();
  return res.redirect("/monthly/");
};

export const getEditMonthly = async (req, res) => {
  const pageTitle = "Edit Monthly";
  const userId = req.session.user._id;
  const today = getToday();
  const goal = await Monthly.findOne({
    owner: userId,
    termStart: { $lte: new Date(today) }, //termStart가 오늘과 같거나 앞에 있고 monthly를 찾습니다.
    termEnd: { $gte: new Date(today) }, //termEnd가 오늘과 같거나 나중에 있는 monthly를 찾습니다.
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

export const postEditMonthly = async (req, res) => {
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
  const monthly = await Monthly.findOne({
    owner: userId,
    termStart: { $lte: new Date(today) }, //termStart가 오늘과 같거나 앞에 있고 monthly를 찾습니다.
    termEnd: { $gte: new Date(today) }, //termEnd가 오늘과 같거나 나중에 있는 monthly를 찾습니다.
  });

  //sub 삭제
  if (deletedSubs) {
    if (typeof deletedSubs === "string") {
      const deletedSub = await MonthlySub.findByIdAndDelete(deletedSubs);
      const impPoint = convertImp(deletedSub.importance);
      deletedSub.eachAsIndepend
        ? (monthly.total -= impPoint * deletedSub.currentValue)
        : deletedSub.completed
        ? (monthly.total -= impPoint)
        : null;
    } else {
      for (let i = 0; i < deletedSubs.length; i++) {
        const deletedSub = await MonthlySub.findByIdAndDelete(deletedSubs[i]);
        const impPoint = convertImp(deletedSub.importance);
        deletedSub.eachAsIndepend
          ? (monthly.total -= impPoint * deletedSub.currentValue)
          : deletedSub.completed
          ? (monthly.total -= impPoint)
          : null;
      }
    }
    monthly.save();
  }

  //기존 sub 내용 변경
  for (let i = 0; i < rest.length; i++) {
    const id = rest[i];
    const body = req.body[id];
    body[2] === "on" && !isNaN(parseInt(body[4]))
      ? await MonthlySub.findByIdAndUpdate(id, {
          importance: body[0],
          content: body[1],
          useMeasure: true,
          measureName: body[3],
          targetValue: parseInt(body[4], 10),
          eachAsIndepend: body[5] ? true : false,
        })
      : await MonthlySub.findByIdAndUpdate(id, {
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
      const newSub = await MonthlySub.create({
        monthly: monthly._id,
        content: subs,
        importance: importances,
        measureName: measureNames ? measureNames : "",
        useMeasure: useMeasures ? true : false,
        targetValue: targetValues ? targetValues : 1,
        eachAsIndepend: eachAsIndepend ? true : false,
      });
      monthly.subs.push(newSub._id);
    } else {
      for (let i = 0; i < subs.length; i++) {
        if (typeof useMeasures !== "string") {
          const newSub = await MonthlySub.create({
            monthly: monthly._id,
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
          monthly.subs.push(newSub._id);
        } else {
          const newSub = await MonthlySub.create({
            monthly: monthly._id,
            content: subs[i],
            importance: importances[i],
            useMeasure: useMeasures === String(i) ? true : false,
            measureName: useMeasures === String(i) ? measureNames : "",
            targetValue: useMeasures === String(i) ? targetValues : 1,
            eachAsIndepend: useMeasures === String(i) ? eachAsIndepend : false,
          });
          monthly.subs.push(newSub._id);
        }
      }
    }
  }

  //monthly 날짜 변경(✔️)
  const termStartDate = new Date(termStart);
  const termEndDate = new Date(termStart);
  monthly.termStart = termStartDate;
  termEndDate.setDate(termStartDate.getDate() + 29);
  monthly.termEnd = termEndDate;
  monthly.save();
  return res.redirect("/monthly/");
};

export const getPreviousMonthly = async (req, res) => {
  const pageTitle = "Previous Monthly";
  const today = getToday();
  const userId = req.session.user._id;
  let goal = null;
  let termStart = "";
  let termEnd = "";

  if (req.originalUrl === "/monthly/previous/") {
    goal = await Monthly.findOne({
      owner: userId,
      termEnd: { $lt: new Date(today) },
    })
      .sort({ date: -1 })
      .populate("subs");

    if (goal) {
      termStart = yyyymmdd(goal.termStart);
      termEnd = yyyymmdd(goal.termEnd);
    }
  } else {
    let date = req.params.date;

    const currentGoal = await Monthly.findOne({
      owner: userId,
      termStart: { $lte: new Date(today) }, //termStart가 오늘과 같거나 앞에 있고 monthly를 찾습니다.
      termEnd: { $gte: new Date(today) }, //termEnd가 오늘과 같거나 나중에 있는 monthly를 찾습니다.
    });
    if (
      new Date(date) >= currentGoal.termStart &&
      new Date(date) <= currentGoal.termEnd
    ) {
      return res.redirect("/monthly/");
    }

    goal = await Monthly.findOne({
      owner: userId,
      termStart: { $lte: new Date(date) }, //termStart가 오늘과 같거나 앞에 있고 monthly를 찾습니다.
      termEnd: { $gte: new Date(date) }, //termEnd가 오늘과 같거나 나중에 있는 monthly를 찾습니다.
    }).populate("subs");
    termStart = yyyymmdd(goal.termStart);
    termEnd = yyyymmdd(goal.termEnd);
  }

  //평균 구하기

  let prevTotal = 0;
  let prevAvg = 0;

  if (termEnd !== "") {
    const prevGoals = await Monthly.find({
      owner: userId,
      termEnd: { $lt: goal.termEnd },
    })
      .sort({ termEnd: -1 })
      .limit(3);

    prevGoals ? prevGoals.forEach((goal) => (prevTotal += goal.total)) : null;
    prevTotal !== 0 ? (prevAvg = prevTotal / prevGoals.length) : null;

    termStart = termStart.split("-");
    termStart =
      termStart[0] + "년 " + termStart[1] + "월 " + termStart[2] + "일";
    termEnd = termEnd.split("-");
    termEnd = termEnd[0] + "년 " + termEnd[1] + "월 " + termEnd[2] + "일";
  }

  return res.render("previousGoal", {
    goal,
    termStart,
    termEnd,
    pageTitle,
    prevAvg,
  });
};

export const postMonthlyCompleted = async (req, res) => {
  const { id } = req.params;
  const monthlySub = await MonthlySub.findById(id);
  monthlySub.completed
    ? (monthlySub.completed = false)
    : (monthlySub.completed = true);
  monthlySub.save();

  if (!monthlySub.eachAsIndepend) {
    const impPoint = convertImp(monthlySub.importance);
    const monthly = await Monthly.findById(monthlySub.monthly);
    monthly.total += impPoint;
    monthly.save();
  }
  return res.sendStatus(200);
};

export const postMonthlyMeasure = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const monthlySub = await MonthlySub.findById(id);
  if (value > monthlySub.targetValue) {
    return res.sendStatus(400);
  } else {
    if (
      monthlySub.eachAsIndepend &&
      parseInt(monthlySub.currentValue, 10) !== parseInt(value, 10)
    ) {
      const impPoint = convertImp(monthlySub.importance);
      const monthly = await Monthly.findById(monthlySub.monthly);
      const diff = parseInt(value, 10) - parseInt(monthlySub.currentValue, 10);
      monthly.total += impPoint * diff;
      monthly.save();
    }
    monthlySub.currentValue = value;
    monthlySub.save();
    return res.sendStatus(200);
  }
};
