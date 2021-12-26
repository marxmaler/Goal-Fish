import Daily from "../models/Daily";
import DailySub from "../models/DailySub";
import Weekly from "../models/Weekly";
import WeeklySub from "../models/WeeklySub";
import WeeklyInter from "../models/WeeklySubInter";
import { getToday, yyyymmdd } from "../functions/time";

export const getHome = async (req, res) => {
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
            model: "WeeklySubInter"
        },
    });

    if (daily && daily.subs.length < 1) {
        await DailySub.deleteMany({
            daily: daily._id
        });
        await Daily.deleteOne({
            _id: daily._id
        });
        return res.redirect("/");
    }

    if (weekly && weekly.subs.length < 1) {
        await WeeklySub.deleteMany({
            weekly: weekly._id
        });
        await Weekly.deleteOne({
            _id: weekly._id
        });
        return res.redirect("/");
    }

    const termStart = yyyymmdd(weekly.term[0]);
    const termEnd = yyyymmdd(weekly.term[6]);

    return res.render("home", {
        daily, weekly, termStart, termEnd, today, pageTitle
    });
}

export const postHome = async (req, res) => {
    if(req.body.changedDaily){
        const changedDailySubId = req.body.changedDaily;
        if(changedDailySubId) {
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
    return res.redirect("/");
}