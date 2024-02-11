import { getWeek, getFirstDayOfMonth, getLastDayOfMonth, getFirstDayOfWeek, getLastDayOfWeek, getWeekNumber, sameDay } from "./calendarDateFunctions";

export class CalendarPopulator {

    // incoming
    periodOption;
    durations;
    date;
    highlightedDays;

    // outgoing
    weeks = [];
    
    // private (but used in tests)
    firstDayDisplayed;
    lastDayDisplayed;
    firstDayOfPeriod;
    lastDayOfPeriod;

    constructor(periodOption, durations, date, highlightedDays) {
        this.periodOption = periodOption;
        this.durations = durations;
        this.date = date;
        this.highlightedDays = highlightedDays;
    }

    populate() {
        this.populateFirstLast();
        this.populateWeeks();
        this.populateWithWeekendDays();
        this.populateWithHighlightedDays();
        this.populateWithSavedDurations();
        return this.weeks;
    }

    populateFirstLast() {
        if(this.periodOption === 'month') {
            this.firstDayOfPeriod = getFirstDayOfMonth(this.date);
            this.firstDayDisplayed = getFirstDayOfWeek(this.firstDayOfPeriod);
            this.lastDayOfPeriod = getLastDayOfMonth(this.date);
            this.lastDayDisplayed = getLastDayOfWeek(this.lastDayOfPeriod);
        } else {
            this.firstDayOfPeriod = getFirstDayOfWeek(this.date);
            this.firstDayDisplayed = this.firstDayOfPeriod;
            this.lastDayOfPeriod = getLastDayOfWeek(this.date);
            this.lastDayDisplayed = this.lastDayOfPeriod;
        }
    }

    populateWeeks() {
        
        let day = this.firstDayDisplayed;
        const weeks = [];
        let i = 0;
        while (day <= this.lastDayOfPeriod) {
            let week = getWeek(day);

            day = new Date(week[week.length -1].getTime());
            day.setDate(day.getDate() + 1);

            week = this.getWeekWrapper(week, i++);
            weeks.push(week);
        }
        this.weeks = [...weeks];
    }

    populateWithWeekendDays() {
        this.weeks.forEach((week) => {
            week.days.forEach((day) => {
                const weekday = day.day.getDay();
                if (weekday === 6 || weekday === 0) {
                    day.isWeekend = true;
                    const isOutsidePeriod = this.isOutsidePeriod(day.day);
                    if(!isOutsidePeriod) {
                        day.classes = 'isWeekend';
                    }
                }
            });
        });
    }

    populateWithHighlightedDays() {
        this.weeks.forEach((week) => {
            week.days.forEach((day) => {
                if (
                    this.highlightedDays.find((highlightedDay) =>
                        sameDay(highlightedDay, day.day)
                    )
                ) {
                    day.isHighlightedDay = true;
                    if(!day.isOutsidePeriod) {
                        day.classes = 'isHighlightedDay';
                    }
                }
            });
        });
    }

    populateWithSavedDurations() {
        this.weeks.forEach((week) => {
            week.days.forEach((day) => {
                // TODO: we don't support durations that span into the next day for now
                const savedDateTimes = this.durations.filter((duration) =>
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
            });
        });
    }

    // ------------------------------------------------------------------------
    // Private
    // ------------------------------------------------------------------------
    
    getWeekWrapper(someDates, indexWeek) {
        const weekNumber = getWeekNumber(someDates[0]);
        someDates = someDates.map((d, indexDay) => this.getDayWrapper(d, indexDay));
        return {
            days: someDates,
            index: indexWeek,
            number: weekNumber
        };
    }

    getDayWrapper(someDate, index) {
        const isOutsidePeriod = this.isOutsidePeriod(someDate);
        return {
            day: someDate,
            index: index,
            isOutsidePeriod: isOutsidePeriod,
            isHighlightedDay: false,
            isWeekend: false,
            classes: isOutsidePeriod ? 'isOutsidePeriod' : 'isWorkingDay',
            quantity: 0,
            title: null,
            title2: null
        };
    }

    isOutsidePeriod(someDate) {
        return (this.periodOption === 'month' 
            && (someDate < this.firstDayOfPeriod || someDate > this.lastDayOfPeriod));
    }
}