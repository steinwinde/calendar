import { LightningElement, api } from 'lwc';
import { getMonths, getYear, markRelevantDays } from './calendarYearUtils';

export default class CalendarYear extends LightningElement {

    // renders the whole annual calendar
    monthsBlocks = [];
    highlights;

    // decides which year is displayed
    _date;
    @api
    get date() {
        return this._date;
    }
    set date(value) {
        this._date = value;
        this.process();
    }

    @api
    get calendarData() {
        // TODO
        return null;
    }
    set calendarData(value) {
        this.highlights = this.getHighlights(value);
        this.process();
    }

    process() {
        if(!this.date || !this.highlights) return;
        const months = getMonths(this.date.getFullYear());
        const monthsBlocks = getYear(months);
        markRelevantDays(monthsBlocks, this.highlights);
        this.monthsBlocks = monthsBlocks;
    }

    // ----------------------------------------------------------------------------------------------------------------

    getHighlights(value) {
        const highlights = [];
        value.forEach(e => {
            const timeStamp = e.fromDateTime.getFullYear() + '-' 
                + (e.fromDateTime.getMonth()+1) + '-' 
                + e.fromDateTime.getDate();
            if(highlights[timeStamp]) {
                highlights[timeStamp].push(e);
            } else {
                highlights[timeStamp] = [e];
            }
        });
        return highlights;
    }

    getDay(dayId) {
        // return the day object for the given dayId
        for(let third of this.monthsBlocks) {
            for(let month of third.months) {
                for(let week of month.weeks) {
                    for(let day of week.days) {
                        if(day.id === dayId) {
                            return day;
                        }
                    }
                }
            }
        }

        return null;
    }

    // ----------------------------------------------------------------------------------------------------------------

    handleDayClick(event) {
        const e = new CustomEvent('dayclick', {detail: event.detail});
        this.dispatchEvent(e);
    }
}