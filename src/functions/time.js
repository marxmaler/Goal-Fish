function timeFormat(time){
    return String(time).padStart(2, "0");
}

export function getToday(){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth()+1;
    let date = now.getDate();

    const today = `${year}-${timeFormat(month)}-${timeFormat(date)}`
    return today;
}

export function getYesterday(){
    const now = new Date();
    now.setDate(now.getDate()-1);
    const year = now.getFullYear();
    const month = now.getMonth()+1;
    let date = now.getDate();

    const yesterday = `${year}-${timeFormat(month)}-${timeFormat(date)}`
    return yesterday;
}

export function getAWeekFromToday(){
    const now = new Date();
    now.setDate(now.getDate()+7);
    const year = now.getFullYear();
    const month = now.getMonth()+1;
    const date = now.getDate();

    const aWeekFromToday = `${year}-${timeFormat(month)}-${timeFormat(date)}`
    return aWeekFromToday;
}

export function yyyymmdd(dateObj){
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth()+1;
    const date = dateObj.getDate();
    const normalDate = `${year}-${timeFormat(month)}-${timeFormat(date)}`
    return normalDate;
}