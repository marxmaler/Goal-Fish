import Weekly from "../models/Weekly";
import WeeklySub from "../models/WeeklySub";
import WeeklyInter from "../models/WeeklySubInter";
import { getToday, getAWeekFromToday } from "../functions/time";


export const getNewWeekly = async (req, res) => {
    const pageTitle = "New Weekly";
    const lastWeekly = await Weekly.findOne().sort({_id: -1}).populate("subs");
    const unfinishedSubs = []
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
}

export const postNewWeekly = async (req, res) => {
    const pageTitle = "New Weekly";
    const {
        date
    } = req.body;
    //해당 날짜에 대해 이미 생성된 주간 목표가 있는지 중복 체크
    const dateExists = await Weekly.exists({
        term: date
    });
    if (dateExists) {
        return res.render("newWeekly", {
            today: getToday(),
            errorMessage: "해당 기간에 이미 주간 목표가 존재합니다.",
            pageTitle,
        });
    }

    console.log(req.body);
    return res.redirect("/");

    // const {
    //     subs,
    //     importances
    // } = req.body;
    // const subIds = [];

    //term에 날짜 7개 넣기
    // const newWeekly = await Weekly.create({
    //     term: [],
    // });

    // if (typeof (subs) !== "string") {
    //     for (let i = 0; i < subs.length; i++) {
    //         if (subs[i].replace(/ /gi, "").length < 1) {
    //             continue; //공백 목표 받지 않기
    //         }
    //         const sub = await WeeklySub.create({
    //             weekly: newWeekly._id,
    //             importance: importances[i],
    //             content: subs[i],
    //         });
    //         subIds.push(sub._id);
    //     }
    // } else {
    //     if (subs.replace(/ /gi, "").length < 1) {
    //         return res.redirect("/");
    //     }
    //     const sub = await WeeklySub.create({
    //         weekly: newWeekly._id,
    //         importance: importances,
    //         content: subs,
    //     });
    //     subIds.push(sub._id);
    // }
    // newWeekly.subs = subIds;
    // await newWeekly.save();
    // return res.redirect("/");
}


export const getEditWeekly = async (req, res) => {
    return res.end();
}

export const postEditWeekly = async (req, res) => {
    return res.end();
}


export const getPreviousWeekly = async (req, res) => {
    return res.end();
}

export const postPreviousWeekly = async (req, res) => {
    return res.end();
}