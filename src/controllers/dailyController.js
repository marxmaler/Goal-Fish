import e from "express";
import Daily from "../models/Daily";
import DailySub from "../models/DailySub";
import { getToday, getYesterday } from "../values/time";

export const getHome = async (req, res) => {
    const daily = await Daily.findOne({
        date: getToday(),
    }).populate("subs");

    if(daily && daily.subs.length<1){
        await DailySub.deleteMany({ daily: daily._id });
        await Daily.deleteOne({ _id: daily._id });
        return res.render("home"); 
    }

    return res.render("home", { daily });
}

export const postHome = async (req, res) => {
    const changedSubId = req.body.changed;
    console.log(req.body);
    const changedSub = await DailySub.findById(changedSubId);
    if(changedSub.completed) {
        changedSub.completed = false;
        await changedSub.save();
    } else {
        changedSub.completed = true;
        await changedSub.save();
    }
    return res.redirect("/");
}

export const getNewDaily = async (req, res) => {
    const lastDaily = await Daily.findOne({ date: getYesterday() }).populate("subs");
    const unfinishedSubs = []
    if(lastDaily) {
        for(let i=0; i<lastDaily.subs.length; i++){
            if(!lastDaily.subs[i].completed){
                unfinishedSubs.push(lastDaily.subs[i]);
            }
        }
    }
    return res.render("newDaily", {
        today: getToday(),
        unfinishedSubs,
    });
}

export const postNewDaily = async (req, res) => {
    const { date } = req.body;
    //해당 날짜에 대해 이미 생성된 일일 목표가 있는지 중복 체크
    const dateExists = await Daily.exists({ date });
    if(dateExists) {
        return res.render("newDaily",{ 
            today: getToday(), 
            errorMessage:"동일한 날짜에 대해 이미 설정된 일일 목표가 존재합니다.",
         });
    }

    const { subs, importances } = req.body;
    const subIds = [];

    const newDaily = await Daily.create({
        date,
    });

    if(typeof(subs)!=="string"){
        for(let i=0; i<subs.length;i++){
            if(subs[i].replace(/ /gi,"").length<1){
                continue; //공백 목표 받지 않기
            }
            const sub = await DailySub.create({
                daily: newDaily._id,
                importance:importances[i],
                content:subs[i],
            });
            subIds.push(sub._id);
        }
    }else {
        if(subs.replace(/ /gi,"").length<1){
            return res.redirect("/");
        }
        const sub = await DailySub.create({
            daily: newDaily._id,
            importance:importances,
            content:subs,
        });
        subIds.push(sub._id);
    }
    newDaily.subs = subIds;
    await newDaily.save();
    return res.redirect("/");
}

export const getEditDaily = async (req, res) => {
    const daily = await Daily.findOne({
        date: getToday(),
    }).populate("subs");

    return res.render("editDaily", {
        daily
    });
}

export const postEditDaily = async(req, res) => {

    const { deletedSubs, newSubs, newImps } = req.body;
    const rest = Object.keys(req.body);
    if(deletedSubs){
        rest.splice(rest.indexOf("deletedSubs"), 1);
    }
    if(newSubs){
        rest.splice(rest.indexOf("newSubs"), 1);
        rest.splice(rest.indexOf("newImps"), 1);
    }
    const daily = await Daily.findOne({date: getToday() });
    //sub 삭제
    if(deletedSubs){
        if(typeof(deletedSubs)==="string") {
            await DailySub.findByIdAndDelete(deletedSubs);
        } else {
            for(let i=0; i<deletedSubs.length; i++){
                await DailySub.findByIdAndDelete(deletedSubs[i]);
            }
        }
    }

    //sub 내용 변경
    for(let i=0; i<rest.length; i++){
        await DailySub.findByIdAndUpdate(rest[i], 
            { content: req.body[rest[i]][1],
                importance: req.body[rest[i]][0],
            });
    }

    if(newSubs){
        if(typeof(newSubs)==="string"&& newSubs.replace(/ /gi,"").length > 0){
            const newSub = await DailySub.create({
                daily: daily._id,
                content:newSubs,
                importance: newImps,
            });
            subIds.push(newSub._id);
    } else {
        for(let i=0; i<newSubs.length; i++){
            const newSub = await DailySub.create({
                daily: daily._id,
                content:newSubs[i],
                importance: newImps[i],
            });
            subIds.push(newSub._id);
        }
    }
}
    await daily.save();
    return res.redirect("/");
}