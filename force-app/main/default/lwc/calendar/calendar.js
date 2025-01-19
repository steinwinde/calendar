import { LightningElement, api, track } from "lwc";
import { getFirstDayOfWeek, getLastDayOfWeek, getWeekNumber, sameDay } from "./calendarDateFunctions";
import {CalendarPopulator} from "./calendarPopulator";
import { CalendarOverlapCalculator } from "./calendarOverlapCalculator";
import { getDateTime } from "./calendarModifier";
import locale from "@salesforce/i18n/locale";

export default class Calendar extends LightningElement {

    LABEL_ALTERNATIVE_TEXT_PREVIOUS = 'previous';
    LABEL_ALTERNATIVE_TEXT_NEXT = 'next';
    LABEL_CALENDAR = 'Calendar';
    LABEL_YEAR = 'Year';
    LABEL_MONTH = 'Month';
    LABEL_WEEK = 'Week';
    LABEL_TODAY = 'Today';
    LABEL_ALTERNATIVE_TEXT_REFRESH = 'Update';
    LABEL_VIEW = 'View';

    // default configuration overwritten from parent LWC
    configuration = {
        period: 'month',
        readOnly: false,
        leftColumnMonth: false,
        leftColumnWeek: false,
        stackedWeek: false,
        partHeightFixedMonth: false,
        partHeightFixedWeek: false,
        heightFixedMonth: false,
        heightFixedWeek: false
    };
    durations = [];
    date = new Date();
    highlightedDays = [];

    get readOnly() {
        return this.configuration.readOnly;
    }

    @api
    get calendarData() {
        return this.durations;
    }
    // We require the parent LWC to only include the calendar when the data is ready
    set calendarData(value) {

        [this.date, this.highlightedDays] = [value.date, value.highlightedDays];
        
        // Durations are sorted by start and end date, e.g. for the overlap calculation
        this.durations = value.durations.map(d => ({...d})).sort((d1, d2) => {
            if (d1.fromDateTime.getTime() < d2.fromDateTime.getTime()) return -1;
            if (d1.fromDateTime.getTime() > d2.fromDateTime.getTime()) return 1;
            if (d1.toDateTime.getTime() < d2.toDateTime.getTime()) return -1;
            if (d1.toDateTime.getTime() > d2.toDateTime.getTime()) return 1;
            return 0;
        });
        new CalendarOverlapCalculator(this.durations).arrange();

        this.populateConfiguration(value.configuration);

        this.populate();
    }

    // TODO: track used to be necessary, otherwise the later coming addition of public holidays does not trigger a refresh
    @track
    weeks = []; // calendar data passed to child LWCs
    weekdays = []; // 7 weekdays like LU, MA, ...
    title = '';

    get periods() {
        return [
            { checked: this.configuration?.period==='year', label: this.LABEL_YEAR, value: 'year' },
            { checked: this.configuration?.period==='month', label: this.LABEL_MONTH, value: 'month' },
            { checked: this.configuration?.period==='week', label: this.LABEL_WEEK, value: 'week' }
        ];
    }

    get isYear() {
        return this.configuration?.period === 'year';
    }

    get isMonth() {
        return this.configuration?.period === 'month';
    }

    get isWeek() {
        return this.configuration?.period === 'week';
    }

    get leftColumn() {
        const result = ((this.configuration.leftColumnMonth && this.isMonth) || (this.configuration.leftColumnWeek && this.isWeek));
        return result;
    }

    get classWeekDayRow() {
        const hasLeftColumn = (this.isMonth && this.configuration.leftColumnMonth)
            || (this.isWeek && this.configuration?.leftColumnWeek);
        const custom = hasLeftColumn ? 'week-day-row-with-left-column' : 'week-day-row-no-left-column';
        return 'week-day-row ' + custom;
    }

    get classCalendarRows() {
        if(this.isMonth) return 'calendar-rows-month';
        if(this.configuration?.stackedWeek) {
            if(this.configuration?.heightFixedWeek) {
                return 'calendar-rows-week-stacked-fixed-height';
            }
            return 'calendar-rows-week-stacked';
        }
        return  'calendar-rows-week-not-stacked';
    }

    get classScrolledArea() {
        const result = ((this.isMonth && this.configuration?.leftColumnMonth) || (this.isWeek && this.configuration?.leftColumnWeek)) 
            ? 'days-and-left-column' : 'days-only';
        return result;
    }

    // ------------------------------------------------------------------------
    // lifecycle hooks
    // ------------------------------------------------------------------------

    connectedCallback() {
        this.populateWeekDays();
    }

    renderedCallback() {
        if(this.isWeek) {
            if(!this.configuration?.stackedWeek) {
                this.adjustScrollTop();
            } else {
                this.refs.scrollarea.scrollTop = 0;
            }
        }
    }

    // ------------------------------------------------------------------------
    // event handlers from this component
    // ------------------------------------------------------------------------

    handleClickLeft(event) {
        if(this.isWeek) {
            this.date.setDate(this.date.getDate() - 7);
        } else if(this.isMonth) {
            const d = this.date.setMonth(this.date.getMonth() - 1);
            this.date = new Date(d);
        } else if(this.isYear) {
            this.date.setFullYear(this.date.getFullYear() - 1);
        }
        this.dispatchDateChange(this.date);
    }

    handleClickRight(event) {
        if(this.isWeek) {
            this.date.setDate(this.date.getDate() + 7);
        } else if(this.isMonth) {
            const d = this.date.setMonth(this.date.getMonth() + 1);
            this.date = new Date(d);
        } else if(this.isYear) {
            this.date.setFullYear(this.date.getFullYear() + 1);
        }
        this.dispatchDateChange(this.date);
    }

    handleClickToday(event) {
        this.date = new Date();
        this.dispatchDateChange(this.date);
    }

    handleClickRefresh(event) {
        this.populate();
    }

    handleChangePeriod(event) {
        if(this.configuration.period === event.detail.value) return;
        this.configuration.period = event.detail.value;
        // this.periods = this.periods.map((p) => {p.checked = p.value === this.configuration.period; return p;});
        this.dispatchPeriodChange();
        this.populate();
    }

    // ------------------------------------------------------------------------
    // events of this component
    // ------------------------------------------------------------------------

    dispatchDateChange(d) {
        const e = new CustomEvent('datechange', {detail: d});
        this.dispatchEvent(e);
    }

    dispatchPeriodChange() {
        const e = new CustomEvent('periodchange', {detail: this.configuration.period});
        this.dispatchEvent(e);
    }

    // ------------------------------------------------------------------------
    // event handlers of events from other components
    // ------------------------------------------------------------------------

    handleDayClick(event) {
        const e = new CustomEvent('dayclick', {detail: event.detail});
        this.dispatchEvent(e);
    }

    // Event coming from calendarPart
    handlePartClick(event) {
        const e = new CustomEvent('partclick', {detail: event.detail});
        this.dispatchEvent(e);
    }

    handlePartDoubleClick(event) {
        const ids = this.getIdsBasedOnSelection(event.detail.id);
        const newDetail = {ids: ids};
        const e = new CustomEvent('partdoubleclick', {detail: newDetail});
        this.dispatchEvent(e);
    }

    handlePartShiftClick(event) {
        // We don't pass this event on, because it doesn't change data. 
        // The selection is to be removed from all parts that are on different days.
        // The selection enables multi-drag drop.
        this.removeSelectionFromPartsOfDifferentDays(event.detail.id);
    }

    handleOnDrop(event) {
        const ids = this.getIdsBasedOnSelection(event.detail.id);
        const newDetail = {ids: ids, day: event.detail.day};
        const e = new CustomEvent('drop', {detail: newDetail});
        this.dispatchEvent(e);
    }

    // ------------------------------------------------------------------------
    // general functions
    // ------------------------------------------------------------------------

    adjustScrollTop() {
        const firstDayOfWeek = getFirstDayOfWeek(this.date);
        const lastDayOfWeek = getLastDayOfWeek(this.date);
        // In case there are no events, we scroll to the START_HOUR
        const START_HOUR = 8;
        // In case the latest events are after 20:00, we scroll to 20:00
        const END_HOUR = 20;
        let earliestHour = this.calendarData
            .filter(d => d.fromDateTime >= firstDayOfWeek && d.toDateTime <= lastDayOfWeek);
        earliestHour = earliestHour.length === 0 ? START_HOUR : earliestHour
            .reduce((acc, curr) => {
                return acc.toLocaleTimeString('sv') < curr.fromDateTime.toLocaleTimeString('sv') ? acc : curr.fromDateTime;},
                new Date('2024-09-01T' + END_HOUR + ':00:00'))
            .getHours();
        if(earliestHour > 20) earliestHour = 20;
        // We use pixels as unit inside, which is good, because it's the same as the required unit for scrollTop.
        // The calendar starts at 19px, each hour requiring 64px. The upper end of the calendar day is always one hour before 
        // the first event of the earliest event of the week.
        const scrollable = this.refs.scrollarea;
        const height = 19 + ((earliestHour - 1) * 64);
        scrollable.scrollTop = height;
    }

    populateConfiguration(configuration) {
        if(configuration) {
            this.configuration = {...Object.assign(this.configuration, configuration)};
        }
    }

    getIdsBasedOnSelection(id) {
        // The id is the id of the duration that was the triggered. If the duration
        // is selected and others are selected as well, then all selected durations
        // are regarded to be triggered.
        const ids = [id];
        const selectedDateTime = getDateTime(id, this.weeks);
        // TODO: Make this more efficient
        if(selectedDateTime.selected) {
            this.weeks.forEach(week => {
                week.days.filter(day => (day.dateTimes.length > 0 && sameDay(day.dateTimes[0].fromDateTime, selectedDateTime.fromDateTime))).forEach(day => {
                    day.dateTimes.forEach(dateTime => {
                        if(dateTime.selected) {
                            ids.push(dateTime.id);
                        }
                    });
                });
            });
        }
        return ids;
    }

    removeSelectionFromPartsOfDifferentDays(id) {
        const clickedDateTime = getDateTime(id, this.weeks);
        clickedDateTime.selected = !clickedDateTime.selected;
        if(!clickedDateTime.selected) {
            // User removed selection, other days stay as (unselected as) they are
            return;
        }

        const fromDateTime = clickedDateTime.fromDateTime;
        this.weeks.forEach(week => {
            week.days.filter(day => (day.dateTimes.length > 0 && !sameDay(day.dateTimes[0].fromDateTime, fromDateTime))).forEach(day => {
                day.dateTimes.forEach(dateTime => {
                    dateTime.selected = false;
                });
            });
        });
    }

    populate() {
        if (!this.date) return;
        try {
            const populator = new CalendarPopulator(
                this.configuration.period, this.durations, this.date, this.highlightedDays);
            this.weeks = populator.populate();
        } catch (error) {
            console.error('Problem setting up calendar data: ', error);
        }
        this.populateTitle();
    }

    populateWeekDays() {
        const options = { weekday: 'short' };
        const monday = new Date('1970-01-05');
        const ar = [];
        for (let i = 0; i < 7; i++) {
            const name = monday
                .toLocaleDateString(locale, options)
                .toUpperCase();
            ar.push({ name: name, index: i });
            monday.setDate(monday.getDate() + 1);
        }
        this.weekdays = [...ar];
    }

    populateTitle() {
        if(this.configuration.period === 'month') {
            const month = this.date.toLocaleString('default', { month: 'long' });
            const year = this.date.getFullYear();
            this.title = month + ' ' + year;
        } else if(this.configuration.period === 'week') {
            const firstDayOfWeek = getFirstDayOfWeek(this.date).toLocaleDateString();
            const lastDayOfWeek = getLastDayOfWeek(this.date).toLocaleDateString();
            this.title = firstDayOfWeek + '-' + lastDayOfWeek + ' (' + this.LABEL_WEEK + ' ' + getWeekNumber(this.date) + ')';
        } else if(this.configuration.period === 'year') {
            this.title = this.date.getFullYear();
        } else {
            // unsupported
        }
    }
}