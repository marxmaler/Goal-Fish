import Weekly from "../models/Weekly";
import WeeklySub from "../models/WeeklySub";
import { getToday, getAWeekFromToday, yyyymmdd } from "../functions/time";

export const getWeeklyHome = async (req, res) => {
  const pageTitle = "Weekly";
  const weekly = await Weekly.findOne({
    date: getToday(),
  })?.populate("subs");

  if (weekly && weekly.subs.length < 1) {
    await WeeklySub.deleteMany({
      weekly: weekly._id,
    });
    await Weekly.deleteOne({
      _id: weekly._id,
    });
    return res.redirect("/weekly/");
  }

  let termStart = weekly?.term[0];
  let termEnd = weekly?.term[6];

  if (termStart) {
    termStart = yyyymmdd(termStart);
    termEnd = yyyymmdd(termEnd);
  }

  return res.render("thisWeek", {
    weekly,
    termStart,
    termEnd,
    pageTitle,
  });
};

export const getNewWeekly = async (req, res) => {
  const pageTitle = "New Weekly";
  const lastWeekly = await Weekly.findOne().sort({ _id: -1 }).populate("subs");
  const unfinishedSubs = [];
  if (lastWeekly) {
    for (let i = 0; i < lastWeekly.subs.length; i++) {
      if (!lastWeekly.subs[i].completed) {
        unfinishedSubs.push(lastWeekly.subs[i]);
      }
    }
  }
  return res.render("newWeekly", {
    today: getToday(),
    aWeekFromToday: getAWeekFromToday(),
    unfinishedSubs,
    pageTitle,
  });
};

export const postNewWeekly = async (req, res) => {
  const { date } = req.body;
  //해당 날짜에 대해 이미 생성된 일일 목표가 있는지 중복 체크

  const dateExists = await Weekly.exists({
    term: date,
  });
  if (dateExists) {
    return res.render("newWeekly", {
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

  const term = [];
  for (let i = 0; i < 7; i++) {
    const termStart = new Date(date);
    termStart.setDate(termStart.getDate() + i);
    term.push(termStart);
  }

  const newWeekly = await Weekly.create({
    term,
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
          const sub = await WeeklySub.create({
            weekly: newWeekly._id,
            importance: importances[i],
            content: subs[i],
            useMeasure: true,
            measureName: String(measureNames.splice(0, 1)),
            targetValue: parseInt(targetValues.splice(0, 1), 10),
          });
          subIds.push(sub._id);
        } else {
          //이 sub가 단위를 사용하지 않는다면
          const sub = await WeeklySub.create({
            weekly: newWeekly._id,
            importance: importances[i],
            content: subs[i],
          });
          subIds.push(sub._id);
        }
      } else if (typeof useMeasures === "string") {
        //useMeasures가 문자열일 때
        if (useMeasures === `${i}`) {
          //이 sub가 단위를 사용한다면
          const sub = await WeeklySub.create({
            weekly: newWeekly._id,
            importance: importances[i],
            content: subs[i],
            useMeasure: true,
            measureName: measureNames,
            targetValue: targetValues,
          });
          subIds.push(sub._id);
        } else {
          //이 sub가 단위를 사용하지 않는다면
          const sub = await WeeklySub.create({
            weekly: newWeekly._id,
            importance: importances[i],
            content: subs[i],
          });
          subIds.push(sub._id);
        }
      } else {
        //useMeasures가 undefine, measurement 쓰는 sub 없음
        const sub = await WeeklySub.create({
          weekly: newWeekly._id,
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
      const sub = await WeeklySub.create({
        weekly: newWeekly._id,
        importance: importances,
        content: subs,
        useMeasure: true,
        measureName: measureNames,
        targetValue: targetValues,
      });
      subIds.push(sub._id);
    } else {
      //measure를 안쓴다면,
      const sub = await WeeklySub.create({
        weekly: newWeekly._id,
        importance: importances,
        content: subs,
      });
      subIds.push(sub._id);
    }
  }
  newWeekly.subs = subIds;
  await newWeekly.save();
  return res.redirect("/weekly/");
};

export const getEditWeekly = async (req, res) => {
  const pageTitle = "Edit Weekly";
  const weekly = await Weekly.findOne({
    term: getToday(),
  }).populate({
    path: "subs",
    populate: {
      path: "intermediate",
      model: "WeeklySubInter",
    },
  });

  const termStart = yyyymmdd(weekly.term[0]);
  const termEnd = yyyymmdd(weekly.term[6]);
  const subNum = weekly.subs.length;

  return res.render("editWeekly", {
    weekly,
    pageTitle,
    termStart,
    termEnd,
    subNum,
  });
};

export const postEditWeekly = async (req, res) => {
  const { termStart, weeklyId } = req.body;
  let { subNum } = req.body;
  subNum = parseInt(subNum, 10);
  const keys = Object.keys(req.body);
  keys.splice(keys.indexOf("termStart"), 1);
  keys.splice(keys.indexOf("subNum"), 1);
  keys.splice(keys.indexOf("weeklyId"), 1);

  const newIntersForOldSubs = [];
  const deletedSubs = [];
  const deletedInters = [];
  const oldies = [];

  //분류(✔️)
  for (let i = 0; i < keys.length; i++) {
    if (keys[i].startsWith("inter")) {
      const splits = keys[i].split("-");
      if (splits[1].length > 1) {
        newIntersForOldSubs.push(keys[i]);
      }
    } else if (keys[i].startsWith("deletedSub")) {
      deletedSubs.push(keys[i]);
    } else if (keys[i].startsWith("deletedInter")) {
      deletedInters.push(keys[i]);
    } else if (
      !keys[i].startsWith("sub") &&
      !keys[i].startsWith("importance")
    ) {
      oldies.push(keys[i]);
    }
  }

  const weekly = await Weekly.findOne({ id: weeklyId });
  const weeklySubs = weekly.subs;
  //새로 만들어진 sub랑 inter 처리(✔️)
  for (let i = 1; i < subNum + 1; i++) {
    const sub = await WeeklySub.create({
      weekly: weeklyId,
      importance: req.body[`importance-${i}`],
      content: req.body[`sub-${i}`],
    });
    weeklySubs.push(sub._id);
    await weekly.save();

    if (req.body[`inters-${i}`]) {
      //sub에 inter가 존재할 때,
      if (typeof req.body[`inters-${i}`] === "string") {
        //sub에 inters가 하나일 때,
        const interContent = req.body[`inters-${i}`];
        if (interContent.replace(/ /gi, "").length > 0) {
          const inter = await WeeklySubInter.create({
            weeklySub: sub._id,
            content: interContent,
          });
          sub.intermediate = [inter._id];
          await sub.save();
        }
      } else {
        //sub에 inters가 복수일 때,
        const interContents = req.body[`inters-${i}`];
        const interIds = [];
        for (let i = 0; i < interContents.length; i++) {
          if (interContents[i].replace(/ /gi, "").length > 0) {
            const inter = await WeeklySubInter.create({
              weeklySub: sub._id,
              content: interContents[i],
            });
            interIds.push(inter._id);
          }
        }
        sub.intermediate = interIds;
        await sub.save();
      }
    }
  }

  //삭제한 sub 처리(✔️)
  for (let i = 0; i < deletedSubs.length; i++) {
    const subId = deletedSubs[i].split("-")[1];
    //inter 삭제
    await WeeklySubInter.deleteMany({ weeklySub: subId });
    //sub 삭제
    await WeeklySub.deleteOne({ _id: subId });

    //weekly에서 해당 sub 제거
    weeklySubs.splice(weeklySubs.indexOf(subId), 1);
    await weekly.save();
  }

  //삭제한 inter 처리(✔️)
  for (let i = 0; i < deletedInters.length; i++) {
    const subId = deletedInters[i].split("-")[1];
    const interIds = req.body[deletedInters[i]];

    const sub = await WeeklySub.findById(subId);
    const subInter = sub.intermediate;
    //inter 삭제 & sub에서 해당 inter제거
    if (typeof interIds === "string") {
      await WeeklySubInter.deleteOne({ _id: interIds });
      subInter.splice(subInter.indexOf(interIds), 1);
    } else {
      for (let j = 0; j < interIds.length; j++) {
        await WeeklySubInter.deleteOne({ _id: interIds[j] });
        subInter.splice(subInter.indexOf(interIds[j]), 1);
      }
    }

    await sub.save();
  }

  // 기존 sub에 새로 추가된 inter 처리(✔️)
  for (let i = 0; i < newIntersForOldSubs.length; i++) {
    const key = newIntersForOldSubs[i]; // inters-61c874c4f6ffe327bec5dffb과 같은 형태
    const inters = req.body[key];
    console.log(inters);
    const subId = key.split("-")[1];
    const sub = await WeeklySub.findById(subId);

    if (typeof inters === "string") {
      const inter = await WeeklySubInter.create({
        weeklySub: subId,
        content: inters,
      });
      sub.intermediate.push(inter._id);
    } else {
      const interIds = [];
      for (let j = 0; j < inters.length; j++) {
        const inter = await WeeklySubInter.create({
          weeklySub: subId,
          content: inters[j],
        });
        interIds.push(inter._id);
      }

      for (let j = 0; j < interIds.length; j++) {
        sub.intermediate.push(interIds[j]);
      }
    }
    await sub.save();
  }

  //기존 sub 처리(✔️)
  for (let i = 0; i < oldies.length; i++) {
    const subId = oldies[i];
    const oldie = req.body[oldies[i]];
    //sub data 확인 및 변경
    const sub = await WeeklySub.findById(subId);
    const subData = oldie.slice(0, 2);

    if (sub.importance != subData[0]) {
      sub.importance = subData[0];
    }
    if (sub.content != subData[1]) {
      sub.content = subData[1];
    }
    await sub.save();
    //inter data 확인 및 변경
    const interData = oldie.slice(2, oldie.length + 1);
    for (let j = 0; j < interData.length; j += 2) {
      const inter = await WeeklySubInter.findById(interData[j]);
      if (inter.content != interData[j + 1]) {
        inter.content = interData[j + 1];
        await inter.save();
      }
    }
  }

  //weekly 날짜 변경(✔️)
  let termStartDate = new Date(termStart);
  if (termStartDate !== weekly.term[0]) {
    const term = [];
    for (let i = 0; i < 7; i++) {
      termStartDate = new Date(termStart);
      termStartDate.setDate(termStartDate.getDate() + i);
      term.push(termStartDate);
    }
    weekly.term = term;
    await weekly.save();
  }

  return res.redirect("/");
};

export const getPreviousWeekly = async (req, res) => {
  return res.end();
};

export const postPreviousWeekly = async (req, res) => {
  return res.end();
};
