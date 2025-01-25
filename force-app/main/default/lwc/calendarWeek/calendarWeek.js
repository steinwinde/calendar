import { LightningElement, api } from 'lwc';
import { getTimeMarkersForDay, getTypes } from './calendarWeekUtils';

export default class CalendarWeek extends LightningElement {

    @api
    configuration;

    @api
    week;
    
    get dataId() {
        return this.week.number + '-' + this.configuration.period;
    }
    
    get weekNumber() {
        return this.week.number;
    }

    get days() {
        return this.week.days;
    }

    // get classPeriod() {
    //     return 'first-column-' + this.configuration.period;
    // }

    get isMonth() {
        return this.configuration.period === 'month';
    }

    get isWeek() {
        return this.configuration.period === 'week';
    }

    get isDay() {
        return this.configuration.period === 'day';
    }

    get leftColumn() {
        return ((this.configuration.leftColumnMonth && this.isMonth) 
            || (this.configuration.leftColumnWeek && this.isWeek)
            || (this.configuration.leftColumnDay && this.isDay));
    }

    get hours() {
        const hours = getTimeMarkersForDay();
        return hours;
    }

    // ------------------------------------------------------------------------
    // events of this component
    // ------------------------------------------------------------------------
    
    handleDayClick(event) {
        const e = new CustomEvent('dayclick', {detail: event.detail});
        this.dispatchEvent(e);
    }

    // ------------------------------------------------------------------------
    // event handlers of events from other components
    // ------------------------------------------------------------------------

    handlePartClick(event) {
        const e = new CustomEvent('partclick', {detail: event.detail});
        this.dispatchEvent(e);
    }

    handlePartDoubleClick(event) {
        const e = new CustomEvent('partdoubleclick', {detail: event.detail});
        this.dispatchEvent(e);
    }

    handlePartShiftClick(event) {
        const e = new CustomEvent('partshiftclick', {detail: event.detail});
        this.dispatchEvent(e);
    }

    handleOnDrop(event) {
        const e = new CustomEvent('drop', {detail: event.detail});
        this.dispatchEvent(e);
    }
}