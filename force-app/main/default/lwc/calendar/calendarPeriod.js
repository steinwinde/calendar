import { getWeek, getFirstDayOfYear, getLastDayOfYear, getFirstDayOfMonth, getLastDayOfMonth, getFirstDayOfWeek, 
    getLastDayOfWeek, getWeekNumber, sameDay } from "./calendarDateFunctions";
import { populateWithWeekendDay, populateWithHighlightedDay, populateWithSavedDuration, getDayWrapper } 
    from "./calendarDay";

export class CalendarPeriod {

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
        this.populateWeekList();
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
        } else if(this.periodOption === 'week') {
            this.firstDayOfPeriod = getFirstDayOfWeek(this.date);
            this.firstDayDisplayed = this.firstDayOfPeriod;
            this.lastDayOfPeriod = getLastDayOfWeek(this.date);
            this.lastDayDisplayed = this.lastDayOfPeriod;
        } else if(this.periodOption === 'year') {
            this.firstDayOfPeriod = getFirstDayOfYear(this.date);
            this.firstDayDisplayed = this.firstDayOfPeriod;
            this.lastDayOfPeriod = getLastDayOfYear(this.date);
            this.lastDayDisplayed = this.lastDayOfPeriod;
        } else {
            throw new Error('Unsupported period option: ' + this.periodOption);
        }
    }

    populateWeekList() {
        
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
                if(!this.isOutsidePeriod(day.day)) {
                    populateWithWeekendDay(day);
                }
            });
        });
    }

    populateWithHighlightedDays() {
        this.weeks.forEach((week) => {
            week.days.forEach((day) => {
                const isOutsidePeriod = this.isOutsidePeriod(day.day);
                populateWithHighlightedDay(day, this.highlightedDays, isOutsidePeriod);
            });
        });
    }

    populateWithSavedDurations() {
        this.weeks.forEach((week) => {
            week.days.forEach((day) => {
                populateWithSavedDuration(day, this.durations);
            });
        });
    }

    // ------------------------------------------------------------------------
    // Private
    // ------------------------------------------------------------------------
    
    getWeekWrapper(someDates, indexWeek) {
        const weekNumber = getWeekNumber(someDates[0]);
        someDates = someDates.map((d, indexDay) => {
            const isOutsidePeriod = this.isOutsidePeriod(d);
            return getDayWrapper(d, indexDay, isOutsidePeriod);
        });
        return {
            days: someDates,
            index: indexWeek,
            number: weekNumber
        };
    }

    // we only show outside days in month view
    isOutsidePeriod(someDate) {
        return (this.periodOption === 'month' 
            && (someDate < this.firstDayOfPeriod || someDate > this.lastDayOfPeriod));
    }
}