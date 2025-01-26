import firstDayOfWeek from '@salesforce/i18n/firstDayOfWeek';

const getWeek = (someDate) => {
    let d = new Date(someDate.getTime());
    const week = [];
    for (let i = 0; i < 7; i++) {
        week.push(new Date(d));
        d.setDate(d.getDate() + 1);
    }
    return week;
}

const getFirstDayOfYear = (someDate) => {
    const firstDate = new Date(
        someDate.getFullYear(),
        0,
        1
    );
    firstDate.setHours(0, 0, 0, 0);
    return firstDate;
}

const getLastDayOfYear = (someDate) => {
    const lastDate = new Date(
        someDate.getFullYear(),
        11,
        31
    );
    lastDate.setHours(23, 59, 59, 999);
    return lastDate;
}

const getFirstDayOfMonth = (someDate) => {
    const firstDate = new Date(
        someDate.getFullYear(),
        someDate.getMonth(),
        1
    );
    firstDate.setHours(0, 0, 0, 0);
    return firstDate;
}

const getLastDayOfMonth = (someDate) => {
    const lastDate = new Date(
        someDate.getFullYear(),
        someDate.getMonth() + 1,
        0
    );
    lastDate.setHours(23, 59, 59, 999);
    return lastDate;
}

const getFirstDayOfWeek = (someDate) => {
    let delta = someDate.getDay() - (firstDayOfWeek-1);
    if(delta < 0) delta += 7;
    const firstDate = new Date(someDate.getTime());
    firstDate.setDate(firstDate.getDate() - delta);
    firstDate.setHours(0, 0, 0, 0);
    return firstDate;
}

const getLastDayOfWeek = (someDate) => {
    let lastDate = getFirstDayOfWeek(someDate);
    lastDate.setDate(lastDate.getDate() + 6);
    lastDate.setHours(23, 59, 59, 999);
    return lastDate;
}

const getWeekNumber = (someDate) => {
    let d = new Date(
        Date.UTC(
            someDate.getFullYear(),
            someDate.getMonth(),
            someDate.getDate()
        )
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

const sameDay = (d1, d2) => {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

export { getWeek, getFirstDayOfYear, getLastDayOfYear, getFirstDayOfMonth, getLastDayOfMonth, getFirstDayOfWeek, getLastDayOfWeek, getWeekNumber, sameDay };