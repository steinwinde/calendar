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
        toDateTime: new Date(endTime + millisecs),
        id: '' + (maxId + 1)
    };
    calendarData.durations.push(duration);
    return {...calendarData};
}

const movePartToDate = (id, day, calendarData, startHour) => {
    const dayDurations = calendarData.durations.filter((duration) => sameDay(duration.fromDateTime, day));
    let endTime = Math.max(...dayDurations.map(dayDuration => dayDuration.toDateTime.getTime()));
    if(endTime === -Infinity) {
        // no durations on this day yet
        endTime = day.setHours(startHour, 0, 0, 0);
    }
    const durationToChange = calendarData.durations.find((duration) => duration.id === id);
    const millisecs = durationToChange.toDateTime.getTime() - durationToChange.fromDateTime.getTime();
    durationToChange.fromDateTime = new Date(endTime);
    durationToChange.toDateTime = new Date(endTime + millisecs);
    return {...calendarData};
}

const deletePart = (id, calendarData) => {
    calendarData.durations = calendarData.durations.filter((duration) => duration.id !== id);
    return {...calendarData};
}

export { createPart, movePartToDate, deletePart };