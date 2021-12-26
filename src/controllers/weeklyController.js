import Weekly from "../models/Weekly";
import WeeklySub from "../models/WeeklySub";
import WeeklySubInter from "../models/WeeklySubInter";
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
        termStart
    } = req.body;

    // term에 일주일 치 date object 넣기
    const term = [];
    for (let i = 0; i < 7; i++) {
        const termStartDate = new Date(termStart);
        termStartDate.setDate(termStartDate.getDate() + i);
        term.push(termStartDate);
    }


    //해당 기간에 이미 작성된 주간 목표가 있는지 중복 체크
    for (let i = 0; i < term.length; i++) {
        const dateExists = await Weekly.exists({
            term: term[i]
        });
        if (dateExists) {
            return res.render("newWeekly", {
                today: getToday(),
                errorMessage: "해당 기간에 이미 작성된 주간 목표가 존재합니다.",
                pageTitle,
            });
        }
    }

    let {
        subNum
    } = req.body;
    subNum = parseInt(subNum, 10);
    if (subNum === 1) { //sub가 하나이거나 하나도 없을 때,
        const sub = req.body["sub-1"];
        if (sub.replace(/ /gi, "").length < 1) { //sub가 하나도 없을 때,
            return res.redirect("/");
        } else { //sub가 하나 있을 때,
            //weekly 생성
            const newWeekly = await Weekly.create({
                term,
            });
            //weeklySub 생성
            const sub = await WeeklySub.create({
                weekly: newWeekly._id,
                importance: req.body["importance-1"],
                content: req.body["sub-1"],
            });

            newWeekly.subs = [sub._id];
            await newWeekly.save();
            //sub에 inters가 하나이거나 하나도 없을 때,
            if (typeof (req.body["inters-1"]) === "string") {
                const interContent = req.body["inters-1"];
                if (interContent.replace(/ /gi, "").length > 0) {
                    const inter = await WeeklySubInter.create({
                        weeklySub: sub._id,
                        content: interContent,
                    });
                    sub.intermediate = [inter._id];
                    await sub.save();
                }
            } else { //sub에 inters가 복수일 때,
                const interContents = req.body["inters-1"];
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

        return res.redirect("/");

    } else { //sub가 복수일 때,
        const newWeekly = await Weekly.create({
            term,
        });
        
        //sub 생성
        const subIds = [];
        for (let i = 1; i < subNum+1; i++) {
            if (req.body[`sub-${i}`].replace(/ /gi, "").length < 1) {
                //sub 내용이 없으면 생성 x
                continue;
            }
            const sub = await WeeklySub.create({
                weekly: newWeekly._id,
                importance: req.body[`importance-${i}`],
                content: req.body[`sub-${i}`],
            });
            subIds.push(sub._id);
            //sub에 inters가 하나이거나 하나도 없을 때,
            if (req.body[`inters-${i}`]) {
                if (typeof (req.body[`inters-${i}`]) === "string") {
                    const interContent = req.body[`inters-${i}`];
                    if (interContent.replace(/ /gi, "").length > 0) {
                        const inter = await WeeklySubInter.create({
                            weeklySub: sub._id,
                            content: interContent,
                        });
                        sub.intermediate = [inter._id];
                        await sub.save();
                    }
                } else { //sub에 inters가 복수일 때,
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
        newWeekly.subs = subIds;
        await newWeekly.save();
        return res.redirect("/");
    }
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