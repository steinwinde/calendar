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

// we regard Monday as the first day of the week
const getFirstDayOfWeek = (someDate) => {
    let monthInYear = someDate.getMonth() < 9 ? '0' + (someDate.getMonth() + 1) : someDate.getMonth() + 1;
    let dayInMonth = someDate.getDate() < 10 ? '0' + someDate.getDate() : someDate.getDate();
    let utcDateString = someDate.getFullYear() + '-' + monthInYear + '-' + dayInMonth + 'T00:00:00.000Z';
    // get the utc date
    let utcDate = new Date(utcDateString);

    // calculate the week start
    const day = utcDate.getDay();
    const diff = utcDate.getDate() - day + (day == 0 ? -6 : 1);
    utcDate = new Date(utcDate.setDate(diff));

    // use the original date and modify it with the utc date
    let result = new Date(someDate);
    result.setDate(utcDate.getDate());
    result.setMonth(utcDate.getMonth());
    result.setFullYear(utcDate.getFullYear());

    return result;
}

// we regard Sunday as the last day of the week
const getLastDayOfWeek = (someDate) => {
    
    let monthInYear = someDate.getMonth() < 9 ? '0' + (someDate.getMonth() + 1) : someDate.getMonth() + 1;
    let dayInMonth = someDate.getDate() < 10 ? '0' + someDate.getDate() : someDate.getDate();
    let utcDateString = someDate.getFullYear() + '-' + monthInYear + '-' + dayInMonth + 'T00:00:00.000Z';
    // get the utc date
    let utcDate = new Date(utcDateString);

    // calculate the week start
    const day = utcDate.getDay();
    const diff = utcDate.getDate() - day + (day == 0 ? -6 : 1);
    utcDate = new Date(utcDate.setDate(diff));

    // TODO: 
    // calculate the week end
    utcDate = new Date(utcDate.setDate(utcDate.getDate() + 6));

    // use the original date and modify it with the utc date
    let result = new Date(someDate);
    result.setDate(utcDate.getDate());
    result.setMonth(utcDate.getMonth());
    result.setFullYear(utcDate.getFullYear());

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