import Daily from "../models/Daily";
import DailySub from "../models/DailySub";
import { getToday, getYesterday } from "../functions/time";

export const getHome = async (req, res) => {
  const pageTitle = "Home";
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

export const postHome = async (req, res) => {
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

  return res.render("editDaily", {
    daily,
    pageTitle,
  });
};

export const postEditDaily = async (req, res) => {
  const { deletedSubs, newSubs, newImps } = req.body;
  const rest = Object.keys(req.body);
  if (deletedSubs) {
    rest.splice(rest.indexOf("deletedSubs"), 1);
  }
  if (newSubs) {
    rest.splice(rest.indexOf("newSubs"), 1);
    rest.splice(rest.indexOf("newImps"), 1);
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

  //sub 내용 변경
  for (let i = 0; i < rest.length; i++) {
    await DailySub.findByIdAndUpdate(rest[i], {
      content: req.body[rest[i]][1],
      importance: req.body[rest[i]][0],
    });
  }

  if (newSubs) {
    if (typeof newSubs === "string" && newSubs.replace(/ /gi, "").length > 0) {
      const newSub = await DailySub.create({
        daily: daily._id,
        content: newSubs,
        importance: newImps,
      });
      daily.subs.push(newSub._id);
    } else {
      for (let i = 0; i < newSubs.length; i++) {
        const newSub = await DailySub.create({
          daily: daily._id,
          content: newSubs[i],
          importance: newImps[i],
        });
        daily.subs.push(newSub._id);
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
