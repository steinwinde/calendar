import locale from '@salesforce/i18n/locale';

// TODO: Does this not already exist somewhere?
const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
}

const getMonthNames = () => {
    const monthNames = [];
    for(let i=0; i<12; i++) {
        const date = new Date(2000, i, 1);
        monthNames.push(date.toLocaleString(locale, { month: 'long' }).toLocaleUpperCase());
    }
    return monthNames;
}

// prepopulate the months array with the months of the year, the index being the month number (starting at 0)
const getMonths = (year) => {
    const monthNames = getMonthNames();
    const months = [];
        for (let monthCounter = 0; monthCounter < 12; monthCounter++) {
            const daysInMonth = getDaysInMonth(monthCounter+1, year);
            const weeks = [];
            let currentWeek = {id: '1', days: []};
            for(let dayCounter=1; dayCounter<=daysInMonth; dayCounter++) {
                const id = year + '-' + (monthCounter+1) + '-' + dayCounter;
                const day = {
                    label: '' + dayCounter,
                    id: id,
                };
                const date = new Date(year, monthCounter, dayCounter);
                // if this is Monday, but not the 1st of the month, start a new week 
                if (date.getDay() === 1 && dayCounter > 1) {
                    weeks.push(currentWeek);
                    currentWeek = {id: '' + (1+weeks.length), days: []};
                }
                currentWeek.days.push(day);
            }

            if(currentWeek.days.length > 0) {
                weeks.push(currentWeek);
            }

            // if the first week is not full, fill it with empty days
            if(weeks[0].days.length < 7) {
                const emptyDays = 7 - weeks[0].days.length;
                for(let i=0; i<emptyDays; i++) {
                    weeks[0].days.unshift({label: '', id: 'empty' + i});
                }
            }

            // if the last week is not full, fill it with empty days
            if(weeks[weeks.length-1].days.length < 7) {
                const emptyDays = 7 - weeks[weeks.length-1].days.length;
                for(let i=0; i<emptyDays; i++) {
                    weeks[weeks.length-1].days.push({label: '', id: 'empty' + i});
                }
            }

            months[monthCounter] = {
                id: monthNames[monthCounter],
                name: monthNames[monthCounter],
                label: monthNames[monthCounter],
                weeks: weeks
            };
        }
        return months;
}

const getYear = (months) => {
    const monthsBlocks = [];
    const fourMonths0 = months.slice(0, 4);
    monthsBlocks.push({id: 'one', months: fourMonths0}); // January-April
    const fourMonths1 = months.slice(4, 8);
    monthsBlocks.push({id: 'two', months: fourMonths1}); // May-August
    const fourMonths2 = months.slice(8, 12);
    monthsBlocks.push({id: 'three', months: fourMonths2}); // September-December
    return monthsBlocks;
}

const getTypes = (highlight) => {
    const result = [];
    highlight.forEach(h => {
        result.push(h.type);
    });
    return result;
}

const markRelevantDays = (monthsBlocks, highlights) => {
    monthsBlocks.forEach(quarter => {
        quarter.months.forEach(month => {
            month.weeks.forEach(week => {
                week.days.forEach(day => {
                    if(highlights[day.id]) {
                        const types = getTypes(highlights[day.id]);
                        day.highlight = {
                            type: types
                        };
                    }
                });
            });
        });
    });
}

export { getMonths, getYear, markRelevantDays };