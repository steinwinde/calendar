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