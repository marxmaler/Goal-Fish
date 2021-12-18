export function getToday(){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth()+1;
    let date = now.getDate();
    if(date <10) {
        date = `0${date}`;
    };
    const today = `${year}-${month}-${date}`
    return today;
}

export function getYesterday(){
    const now = new Date();
    now.setDate(now.getDate()-1);
    const year = now.getFullYear();
    const month = now.getMonth()+1;
    let date = now.getDate();
    if(date <10) {
        date = `0${date}`;
    };
    const yesterday = `${year}-${month}-${date}`
    return yesterday;
}