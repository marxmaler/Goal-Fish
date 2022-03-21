import { getToday, mmdd, yyyymmdd } from "../functions/time";
import { isHeroku } from "../init";
import Daily from "../models/Daily";
import Weekly from "../models/Weekly";
import Monthly from "../models/Monthly";
import Yearly from "../models/Yearly";

export const getPreviousGoal = async (req, res) => {
  const goalType = req.baseUrl.replace("/", "");
  const goalTypeStarstWithCap =
    goalType.slice(0, 1).toUpperCase() + goalType.slice(1);
  const model =
    goalType === "daily"
      ? Daily
      : goalType === "weekly"
      ? Weekly
      : goalType === "monthly"
      ? Monthly
      : Yearly;
  const pageTitle = `Previous ${goalTypeStarstWithCap}`;
  let timeDiff = req.session.timeDiff;
  if (!timeDiff) {
    return res.redirect("/user/logout");
  }
  timeDiff = isHeroku ? timeDiff : 0;
  const today = getToday(timeDiff);
  const { id: goalId } = req.params;
  const userId = req.session.user._id;

  let date = null;
  let termStart = null;
  let termEnd = null;

  let currentGoal = null;

  if (goalType !== "daily") {
    currentGoal = goalId
      ? await model.findById(goalId)
      : await model
          .findOne({
            owner: userId,
            termEnd: { $gte: new Date(today) },
          })
          .sort({ termEnd: -1 });
  } else {
    date = req.params.date;
    if (date && date === today) {
      return res.redirect("/");
    }
  }

  let goal = null;
  if (goalType !== "daily") {
    goal = currentGoal
      ? await model
          .findOne({
            owner: userId,
            termEnd: { $lt: currentGoal.termEnd },
          })
          .sort({ termEnd: -1 })
          .populate("subs")
      : await model
          .findOne({
            owner: userId,
          })
          .sort({ termEnd: -1 })
          .populate("subs");
  } else {
    if (!date) {
      goal = await model
        .findOne({
          owner: userId,
          date: { $lt: new Date(today) },
        })
        .sort({ date: -1 });
      if (goal) {
        return res.redirect(`/${goalType}/${yyyymmdd(goal.date)}`);
      }
    } else {
      goal = await Daily.findOne({ owner: userId, date }).populate("subs");
    }
  }

  let prevTotal = 0;
  let prevAvg = 0;
  let prevGoals = null;
  let prevGoalArr = [];
  let prevGoalDates = [];
  const goalLimit =
    goalType === "daily"
      ? 7
      : goalType === "weekly"
      ? 4
      : goalType === "monthly"
      ? 3
      : 2;

  if (goal) {
    //평균 구하기
    prevGoalArr = [goal.total];

    if (goalType !== "daily") {
      prevGoalDates = [`${mmdd(goal.termStart)}~${mmdd(goal.termEnd)}`];
      prevGoals = await model
        .find({
          owner: userId,
          termEnd: { $lt: goal.termEnd },
        })
        .sort({ termEnd: -1 })
        .limit(goalLimit);
    } else {
      prevGoalDates = [mmdd(goal.date)];
      prevGoals = await model
        .find({
          owner: userId,
          date: { $lt: new Date(date) },
        })
        .sort({ date: -1 })
        .limit(goalLimit);
    }

    prevGoals &&
      prevGoals.forEach((goal) => {
        prevTotal += goal.total;
        prevGoalArr.push(goal.total);
        goalType !== "daily"
          ? prevGoalDates.push(`${mmdd(goal.termStart)}~${mmdd(goal.termEnd)}`)
          : prevGoalDates.push(mmdd(goal.date));
      });
    prevTotal !== 0 && (prevAvg = prevTotal / prevGoals.length);

    prevGoalArr.length > goalLimit &&
      (prevGoalArr = prevGoalArr.slice(0, goalLimit));
    prevGoalDates.length > goalLimit &&
      (prevGoalDates = prevGoalDates.slice(0, goalLimit));

    prevGoalArr = prevGoalArr.reverse();
    prevGoalDates = prevGoalDates.reverse();
  }

  if (goalType !== "daily") {
    termStart = mmdd(goal.termStart);
    termEnd = mmdd(goal.termEnd);
  }

  return res.render("previousGoal", {
    goal,
    date,
    termStart,
    termEnd,
    pageTitle,
    prevAvg,
    prevGoals: prevGoalArr,
    prevGoalDates,
  });
};
