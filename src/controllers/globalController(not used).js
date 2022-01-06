import Daily from "../models/Daily";
import DailySub from "../models/DailySub";
import Weekly from "../models/Weekly";
import WeeklySub from "../models/WeeklySub";
import WeeklyInter from "../models/WeeklySubInter";
import { getToday, yyyymmdd } from "../functions/time";
import WeeklySubInter from "../models/WeeklySubInter";

//이 파일은 현재 사용되지 않고 있습니다.
//추후 주간 목표 조회 페이지에서 재활용할 수 있도록 코드만 보존합니다.
const getHome = async (req, res) => {
  const pageTitle = "Home";
  const today = getToday();
  const daily = await Daily.findOne({
    date: today,
  }).populate("subs");

  const weekly = await Weekly.findOne({
    term: today,
  }).populate({
    path: "subs",
    populate: {
      path: "intermediate",
      model: "WeeklySubInter",
    },
  });

  if (daily && daily.subs.length < 1) {
    await DailySub.deleteMany({
      daily: daily._id,
    });
    await Daily.deleteOne({
      _id: daily._id,
    });
    return res.redirect("/");
  }

  if (weekly && weekly.subs.length < 1) {
    await Weekly.deleteOne({
      _id: weekly._id,
    });
    return res.redirect("/");
  }

  if (weekly) {
    const termStart = yyyymmdd(weekly.term[0]);
    const termEnd = yyyymmdd(weekly.term[6]);

    return res.render("home", {
      daily,
      weekly,
      termStart,
      termEnd,
      today,
      pageTitle,
    });
  }

  return res.render("home", {
    daily,
    today,
    pageTitle,
  });
};

const postHome = async (req, res) => {
  const { id } = req.body;
  // daily가 checked된 경우
  if (req.body.changedDaily) {
    const changedDailySubId = req.body.changedDaily;
    if (changedDailySubId) {
      const changedDailySub = await DailySub.findById(changedDailySubId);
      if (changedDailySub.completed) {
        changedDailySub.completed = false;
        await changedDailySub.save();
      } else {
        changedDailySub.completed = true;
        await changedDailySub.save();
      }
    }
  }

  // weekly sub가 checked된 경우
  if (req.body.changedWeekly) {
    const changedWeeklySubId = req.body.changedWeekly;
    if (changedWeeklySubId) {
      const changedWeeklySub = await WeeklySub.findById(changedWeeklySubId);
      if (changedWeeklySub.completed) {
        changedWeeklySub.completed = false;
        await changedWeeklySub.save();
      } else {
        changedWeeklySub.completed = true;
        await changedWeeklySub.save();
      }
    }
  }

  // weekly inter가 checked된 경우
  if (req.body.changedWeeklyInter) {
    const changedWeeklyInterId = req.body.changedWeeklyInter;
    if (changedWeeklyInterId) {
      const changedWeeklyInter = await WeeklySubInter.findById(
        changedWeeklyInterId
      );
      if (changedWeeklyInter.completed) {
        changedWeeklyInter.completed = false;
        await changedWeeklyInter.save();
      } else {
        changedWeeklyInter.completed = true;
        await changedWeeklyInter.save();
      }
    }
  }

  return res.sendStatus(200);
};
