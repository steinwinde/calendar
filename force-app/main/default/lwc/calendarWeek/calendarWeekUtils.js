export const getTimeMarkersForDay = () => {
    const startHour = 0;
    const endHour = 24;
    const hours = [];
    for(let i = startHour; i <= endHour; i++) {
        const hour = (i + ':00').padStart(5, '0');
        hours.push({hour: hour, index: 'hour' + i});
    }
    return hours;
}

// if the week has parts of all 3 types, return 3; if 2, return 2; else return 1
export const getTypes = (days) => {
    const types = new Set();
    days.forEach(day => {
        day.dateTimes.forEach(dt => {
            types.add(dt.type);
        });
    });
    return types;
}