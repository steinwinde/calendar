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

const getFirstDayOfMonth = (someDate) => {
    const firstDate = new Date(
        someDate.getFullYear(),
        someDate.getMonth(),
        1
    );
    return firstDate;
}

const getLastDayOfMonth = (someDate) => {
    const lastDate = new Date(
        someDate.getFullYear(),
        someDate.getMonth() + 1,
        0
    );
    return lastDate;
}

// getDay() returns the delta to the first day of the week (the time calculated according to different locales),
// but always with Sunday representing 0
// returns 0 for Sunday, 1 for Monday, etc. - 6 for Saturday (e.g. Saudi Arabia) - according to local time!
// firstDayOfWeek returns what is the first day of the week according to user settings,
// 1 for Sunday, 2 for Monday, etc. - 7 for Saturday (e.g. Saudi Arabia)
const getFirstDayOfWeek = (someDate) => {
    let delta = someDate.getDay() - (firstDayOfWeek-1);
    if(delta < 0) delta += 7;
    const result = new Date(someDate.getTime());
    result.setDate(result.getDate() - delta);
    return result;
}

const getLastDayOfWeek = (someDate) => {
    let result = getFirstDayOfWeek(someDate);
    result.setDate(result.getDate() + 6);
    return result;
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

// const setFirstDayOfWeek = (someDate) => {
//     const distanceToSunday = someDate.getDay();
//     const distanceToMonday =
//         distanceToSunday === 0 ? 6 : distanceToSunday - 1;
//     someDate.setDate(someDate.getDate() - distanceToMonday);
// }

const sameDay = (d1, d2) => {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

export { getWeek, getFirstDayOfMonth, getLastDayOfMonth, getFirstDayOfWeek, getLastDayOfWeek, getWeekNumber, sameDay };