import Daily from "../models/Daily";
import DailySub from "../models/DailySub";
import { getToday, getYesterday } from "../functions/time";

export const getHome = async (req, res) => {
  const pageTitle = "Daily";
  const today = getToday();
  const daily = await Daily.findOne({
    date: today,
  }).populate("subs");

  if (daily && daily.subs.length < 1) {
    await DailySub.deleteMany({
      daily: daily._id,
    });
    await Daily.deleteOne({
      _id: daily._id,
    });
    return res.redirect("/");
  }

  return res.render("home", {
    daily,
    today,
    pageTitle,
  });
};

export const postCompleted = async (req, res) => {
  const { id } = req.params;
  const dailySub = await DailySub.findById(id);
  if (dailySub.completed) {
    dailySub.completed = false;
    dailySub.save();
  } else {
    dailySub.completed = true;
    dailySub.save();
  }

  return res.sendStatus(200);
};

export const postMeasure = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const dailySub = await DailySub.findById(id);
  if (value > dailySub.targetValue) {
    return res.sendStatus(200);
  } else {
    dailySub.currentValue = value;
    dailySub.save();
    return res.sendStatus(200);
  }
};

export const getNewDaily = async (req, res) => {
  const pageTitle = "New Daily";
  const lastDaily = await Daily.findOne({
    date: getYesterday(),
  }).populate("subs");
  const unfinishedSubs = [];
  if (lastDaily) {
    for (let i = 0; i < lastDaily.subs.length; i++) {
      if (!lastDaily.subs[i].completed) {
        unfinishedSubs.push(lastDaily.subs[i]);
      }
    }
  }
  return res.render("newDaily", {
    today: getToday(),
    unfinishedSubs,
    pageTitle,
  });
};

export const postNewDaily = async (req, res) => {
  const pageTitle = "New Daily";
  const { date } = req.body;
  //해당 날짜에 대해 이미 생성된 일일 목표가 있는지 중복 체크
  const dateExists = await Daily.exists({
    date,
  });
  if (dateExists) {
    return res.render("newDaily", {
      today: getToday(),
      errorMessage: "동일한 날짜에 대해 이미 설정된 일일 목표가 존재합니다.",
      pageTitle,
    });
  }

  const { subs, importances, useMeasures, measureNames, targetValues } =
    req.body;
  const subIds = [];

  if (subs === undefined) {
    //subs가 없을 때
    return res.redirect("/");
  }
  const newDaily = await Daily.create({
    date,
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
          const sub = await DailySub.create({
            daily: newDaily._id,
            importance: importances[i],
            content: subs[i],
            useMeasure: true,
            measureName: String(measureNames.splice(0, 1)),
            targetValue: parseInt(targetValues.splice(0, 1), 10),
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
  const daily = await Daily.findOne({
    date: getToday(),
  }).populate("subs");

  if (!daily) {
    //편집 중에 자정이 지났을 때 새로고침으로 발생할 수 있는 에러 방지
    return res.redirect("/");
  }

  return res.render("editDaily", {
    daily,
    pageTitle,
  });
};

export const postEditDaily = async (req, res) => {
  console.log(req.body);
  const {
    deletedSubs,
    subs,
    importances,
    useMeasures,
    measureNames,
    targetValues,
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
  }

  const daily = await Daily.findOne({
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
    req.body[id].length === 5
      ? await DailySub.findByIdAndUpdate(id, {
          importance: req.body[id][0],
          content: req.body[id][1],
          useMeasure: true,
          measureName: req.body[id][3],
          targetValue: req.body[id][4],
        })
      : await DailySub.findByIdAndUpdate(id, {
          importance: req.body[id][0],
          content: req.body[id][1],
          useMeasure: false,
          measureName: req.body[id][2],
          targetValue: req.body[id][3],
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
        targetValue: targetValues ? targetValues : 9999,
      });
      daily.subs.push(newSub._id);
    } else {
      for (let i = 0; i < subs.length; i++) {
        if (typeof useMeasures !== "string") {
          const newSub = await DailySub.create({
            daily: daily._id,
            content: subs[i],
            importance: importances[i],
            useMeasure: useMeasures.includes(i) ? true : false,
            measureName: useMeasures.includes(i)
              ? measureNames.splice(0, 1)
              : "",
            targetValue: useMeasures.includes(i)
              ? targetValues.splice(0, 1)
              : 9999,
          });
          daily.subs.push(newSub._id);
        } else {
          const newSub = await DailySub.create({
            daily: daily._id,
            content: subs[i],
            importance: importances[i],
            useMeasure: useMeasures === String(i) ? true : false,
            measureName: useMeasures === String(i) ? measureNames : "",
            targetValue: useMeasures === String(i) ? targetValues : 9999,
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
  let date = req.params.date;
  const daily = await Daily.findOne({ date }).populate("subs");
  date = date.split("-");
  date = date[0] + "년 " + date[1] + "월 " + date[2] + "일";
  return res.render("previousDaily", { daily, date, pageTitle });
};

export const postPreviousDaily = async (req, res) => {
  const date = req.params.date;
  const changedSubId = req.body.changed;
  if (changedSubId) {
    const changedSub = await DailySub.findById(changedSubId);
    if (changedSub.completed) {
      changedSub.completed = false;
      await changedSub.save();
    } else {
      changedSub.completed = true;
      await changedSub.save();
    }
  }
  return res.redirect(`/daily/${date}`);
};
