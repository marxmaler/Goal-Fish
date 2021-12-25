import Daily from "../models/Daily";
import DailySub from "../models/DailySub";
import Weekly from "../models/Weekly";
import WeeklySub from "../models/WeeklySub";
import WeeklyInter from "../models/WeeklySubInter";
import { getToday, getYesterday } from "../functions/time";

export const getHome = async (req, res) => {
    const pageTitle = "Home";
    const daily = await Daily.findOne({
        date: getToday(),
    }).populate("subs");

    if (daily && daily.subs.length < 1) {
        await DailySub.deleteMany({
            daily: daily._id
        });
        await Daily.deleteOne({
            _id: daily._id
        });
        return res.render("home");
    }

    return res.render("home", {
        daily, pageTitle
    });
}

export const postHome = async (req, res) => {
    const changedSubId = req.body.changed;
    if(changedSubId) {
        const changedSub = await DailySub.findById(changedSubId);
        if (changedSub.completed) {
            changedSub.completed = false;
            await changedSub.save();
        } else {
            changedSub.completed = true;
            await changedSub.save();
        }
    }
    return res.redirect("/");
}