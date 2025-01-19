import locale from '@salesforce/i18n/locale';

const sameDay = (d1, d2) => {
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
}

const createPart = (day, calendarData, startHour) => {
    const dayDurations = calendarData.durations.filter((duration) => sameDay(duration.fromDateTime, day));
    let endTime = Math.max(...dayDurations.map(dayDuration => dayDuration.toDateTime.getTime()));
    let maxId = Math.max(...calendarData.durations.map(duration => duration.id));
    if(endTime === -Infinity) {
        // no durations on this day yet
        endTime = day.setHours(startHour, 0, 0, 0);
    }
    const millisecs = 60 * 60 * 1000;
    const duration = {
        fromDateTime: new Date(endTime),
        selected: false,
        title: 'New Event',
        toDateTime: new Date(endTime + millisecs),
        type: 'one',
        id: '' + (maxId + 1)
    };
    calendarData.durations.push(duration);
    return {...calendarData};
}

const movePartsToDate = (ids, day, calendarData, startHour) => {
    const dayDurations = calendarData.durations.filter((duration) => sameDay(duration.fromDateTime, day));
    let endTime = Math.max(...dayDurations.map(dayDuration => dayDuration.toDateTime.getTime()));
    if(endTime === -Infinity) {
        // no durations on this day yet
        endTime = day.setHours(startHour, 0, 0, 0);
    }
    const durationsToChange = calendarData.durations.filter((duration) => ids.includes(duration.id));
    durationsToChange.forEach((durationToChange) => {
        const millisecs = durationToChange.toDateTime.getTime() - durationToChange.fromDateTime.getTime();
        durationToChange.fromDateTime = new Date(endTime);
        endTime = endTime + millisecs;
        durationToChange.toDateTime = new Date(endTime);
    });
    return {...calendarData};
}

const deletePart = (obj, calendarData) => {
    const ids = obj.ids;
    calendarData.durations = calendarData.durations.filter(duration => !ids.includes(duration.id));
    return {...calendarData};
}

const getSchedulerButtonLabel = (fromDateTime, toDateTime) => {
    return fromDateTime.toLocaleTimeString(locale, {timeStyle: 'short'}) 
        + ' - ' + toDateTime.toLocaleTimeString(locale, {timeStyle: 'short'});
}

export { createPart, movePartsToDate, deletePart, getSchedulerButtonLabel };