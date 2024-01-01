const getHoursWorked = (fromDateTime, toDateTime) => {
    // 100% = 8h = 8*60*60*1000ms = 28800000ms
    const msWorked = (toDateTime.getTime() - fromDateTime.getTime());
    const msHour = 3600000;
    // const hoursWorked = Math.round(msWorked / msHour);
    const hoursWorked = msWorked / msHour;
    return hoursWorked;
}

const getHeight = (configuration, fromDateTime, toDateTime) => {
    // if(configuration.period === 'month') {
    //     return 1.3;
    // }
    const hoursWorked = getHoursWorked(fromDateTime, toDateTime);
    // This value depends on the div height configured in calendarWeek.css
    // We assume an 8 max hours working day
    // 8.7rem is the available height of the space below the day number in a month cell
    // 32rem is the available height of the space for 8 hours in a week cell
    const factorWeek = 32; 
    const workload = hoursWorked / 8 * factorWeek;
    return workload;
}

export { getHeight };