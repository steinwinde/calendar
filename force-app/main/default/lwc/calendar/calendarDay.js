import { sameDay } from "./calendarDateFunctions";

// 1000*60*60 is one hour in milliseconds, 8 is the number of hours in a working day, 100 expressed in percent
const FACTOR8 = 288000; // 1000 * 60 * 60 * 8 / 100
const FACTOR = 864000; // 1000 * 60 * 60 * 24 / 100

const getDayKey = (d) => {
    // Sweden uses yyyy-mm-dd
    return d.toLocaleDateString('sv');
}

const getGradWeek = (number, percentage) => {
    if(percentage > 100) percentage = 100;
    let value = Math.round(percentage * 100) / 100;
    return '--grad' + number + ': ' + value + '%';
}

// TODO: I'm not sure we need a different getGrad for month and week
const getGradMonth = (number, percentage) => {
    if(percentage > 100) percentage = 100;
    let value = Math.round(percentage * 100) / 100;
    return '--grad' + number + ': ' + value + '%';
}

const populateWithWeekendDay = (day) => {
    const weekday = day.day.getDay();
    if (weekday === 6 || weekday === 0) {
        day.isWeekend = true;
    }
}

const populateWithHighlightedDay = (day, highlightedDays, isOutsidePeriod) => {
    const highlightedDate = highlightedDays.find((highlightedDay) => sameDay(highlightedDay.date, day.day));
    if (highlightedDate) {
        day.isHighlightedDay = true;
        if(!isOutsidePeriod) {
            const type = populateWithHighlightedDay.type ?? '';
            day.classes = 'isHighlightedDay' + type;
        }
    }
}

const populateWithSavedDuration = (day, durations) => {
    // TODO: we don't support durations that span into the next day for now
    const savedDateTimes = durations.filter((duration) =>
        sameDay(duration.fromDateTime, day.day)
    );
    if (savedDateTimes) {
        day.dateTimes = savedDateTimes;
        // savedDateTimes.forEach(savedDateTime => {
        //     day.fromDateTime = savedDateTime.fromDateTime;
        //     day.toDateTime = savedDateTime.toDateTime;
        //     day.title = savedDateTime.title;
        //     day.type = savedDateTime.type;
        // });
    } else {
        day.dateTimes = [];
    }
}

const getDayWrapper = (d, index, isOutsidePeriod) => {
    return {
        day: d,
        index: index,
        isOutsidePeriod: isOutsidePeriod,
        isHighlightedDayOne: false,
        isHighlightedDayTwo: false,
        isHighlightedDayThree: false,
        isHighlightedDayFour: false,
        isHighlightedDayFourGraded: 0,
        isWeekend: false,
        classes: isOutsidePeriod ? 'isOutsidePeriod' : 'isWorkingDay',
        quantity: 0,
        title: null,
        title2: null,
    };
}

const populateDay = (date, highlightedDays, durations) => {
    const day = getDayWrapper(date, 0, null);
    populateWithWeekendDay(day);
    populateWithHighlightedDay(day, highlightedDays);
    populateWithSavedDuration(day, durations);
    return day;
}

export { populateWithWeekendDay, populateWithHighlightedDay, populateWithSavedDuration, getDayWrapper, populateDay };