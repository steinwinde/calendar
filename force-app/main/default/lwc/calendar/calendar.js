import { LightningElement, api, track } from "lwc";
import { getFirstDayOfWeek, getLastDayOfWeek, getWeekNumber, sameDay } from "./calendarDateFunctions";
import {CalendarPeriod} from "./calendarPeriod";
import {populateDay} from "./calendarDay";
import { CalendarOverlapCalculator } from "./calendarOverlapCalculator";
import { getDateTime } from "./calendarModifier";
import locale from "@salesforce/i18n/locale";
import FORM_FACTOR from '@salesforce/client/formFactor';
import calendarMobile from './calendarMobile.html';
import calendar from './calendar.html';

export default class Calendar extends LightningElement {

    LABEL_ALTERNATIVE_TEXT_PREVIOUS = 'previous';
    LABEL_ALTERNATIVE_TEXT_NEXT = 'next';
    LABEL_CALENDAR = 'Calendar';
    LABEL_DAY = 'Day';
    LABEL_WEEK = 'Week';
    LABEL_MONTH = 'Month';
    LABEL_YEAR = 'Year';
    LABEL_TODAY = 'Today';
    LABEL_ALTERNATIVE_TEXT_REFRESH = 'Update';
    LABEL_VIEW = 'View';

    isMobile = FORM_FACTOR === 'Small';
    isDesktop = FORM_FACTOR === 'Large' || FORM_FACTOR === 'Medium';

    // swipe support
    touchStartX;

    // default configuration overwritten from parent LWC
    configuration = {
        period: 'month',
        readOnly: false,
        leftColumnMonth: false,
        leftColumnWeek: false,
        // leftColumnDay: false,
        stackedWeek: false,
        partHeightFixedMonth: false,
        partHeightFixedWeek: false,
        partHeightFixedDay: false,
        heightFixedMonth: false,
        heightFixedWeek: false,
        heightFixedDay: false
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

        this.populateConfiguration(value.configuration);
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

        this.populate();
    }

    // TODO: track used to be necessary, otherwise the later coming addition of public holidays does not trigger a refresh
    @track
    weeks = []; // calendar data passed to child LWCs

    // for day view
    @track
    day;

    weekdays = []; // 7 weekdays like LU, MA, ...
    title = '';

    _periods = [
        { checked: this.configuration?.period==='year', label: this.LABEL_YEAR, value: 'year' },
        { checked: this.configuration?.period==='month', label: this.LABEL_MONTH, value: 'month' },
        { checked: this.configuration?.period==='week', label: this.LABEL_WEEK, value: 'week' },
        { checked: this.configuration?.period==='day', label: this.LABEL_DAY, value: 'day' }
    ];

    get periods() {
        if(this.configuration?.periods) {
            return this._periods.filter(period => this.configuration.periods.includes(period.value));
        }
        return this._periods;
    }
    set periods(value) {
        this._periods = value;
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

    get isDay() {
        return this.configuration?.period === 'day';
    }

    get showWeekDays() {
        return this.isWeek || this.isMonth;
    }

    get leftColumn() {
        const result = this.isDesktop 
            && ((this.configuration?.leftColumnMonth && this.isMonth) 
                || (this.configuration?.leftColumnWeek && this.isWeek)
                // || (this.configuration?.leftColumnDay && this.isDay)
            );
        return result;
    }

    get classWeekDayRow() {
        return this.isWeek ? 
            (!this.configuration?.stackedWeek ? 'week-day-row grid-columns-hidden-column' : 'week-day-row grid-columns-simple')
            : (this.configuration?.leftColumnMonth ? 'week-day-row grid-columns-regular' : 'week-day-row grid-columns-simple');
    }

    get classCalendarRows() {
        // TODO: Compare this method with calendar currently in use
        if(this.isMonth) return 'calendar-rows-month';
        if(this.configuration?.stackedWeek || this.configuration?.stackedDay) {
            if(this.configuration?.heightFixedWeek || this.configuration?.heightFixedDay) {
                return 'calendar-rows-week-stacked-fixed-height';
            }
            return 'calendar-rows-week-stacked';
        }
        return  'calendar-rows-week-not-stacked';
    }

    get classScrolledArea() {
        const result = ((this.isMonth && this.configuration?.leftColumnMonth) 
            || (this.isWeek && this.configuration?.leftColumnWeek)
            // || (this.isDay && this.configuration?.leftColumnDay)
        ) 
            ? 'days-and-left-column' : 'days-only';
        return result;
    }

    // ------------------------------------------------------------------------
    // lifecycle hooks
    // ------------------------------------------------------------------------

    connectedCallback() {
        this.populateWeekDays();
    }

    render() {
        if(this.isMobile) {
            return calendarMobile;
        }

        return calendar;
    }

    renderedCallback() {
        if(this.isWeek) {
            if(!this.configuration?.stackedWeek) {
                this.adjustScrollTopOfWeek();
            } else {
                this.refs.scrollarea.scrollTop = 0;
            }
        } else if(this.isDay) {
            if(!this.configuration?.stackedDay) {
                this.adjustScrollTopOfDay();
            } else {
                this.refs.scrollarea.scrollTop = 0;
            }
        }
    }

    // ------------------------------------------------------------------------
    // event handlers from this component
    // ------------------------------------------------------------------------

    handleClickLeft() {
        if(this.isDay) {
            this.date.setDate(this.date.getDate() - 1);
        } else if(this.isWeek) {
            this.date.setDate(this.date.getDate() - 7);
        } else if(this.isMonth) {
            const d = this.date.setMonth(this.date.getMonth() - 1);
            this.date = new Date(d);
        } else if(this.isYear) {
            this.date.setFullYear(this.date.getFullYear() - 1);
        }
        this.dispatchDateChange(this.date);
    }

    handleClickRight() {
        if(this.isDay) {
            this.date.setDate(this.date.getDate() + 1);
        } else if(this.isWeek) {
            this.date.setDate(this.date.getDate() + 7);
        } else if(this.isMonth) {
            const d = this.date.setMonth(this.date.getMonth() + 1);
            this.date = new Date(d);
        } else if(this.isYear) {
            this.date.setFullYear(this.date.getFullYear() + 1);
        }
        this.dispatchDateChange(this.date);
    }

    handleClickToday() {
        this.date = new Date();
        this.dispatchDateChange(this.date);
    }

    handleClickRefresh() {
        this.populate();
    }

    handleChangePeriod(event) {
        // the 1st is for desktop (lightning-button-menu), the 2nd for mobile (lightning-icon-button)
        const period = event.detail.value ?? event.currentTarget.value;
        if(this.configuration.period === period) return;
        this.configuration.period = period;
        this.periods = this.periods.map((p) => {
            p.checked = p.value === this.configuration.period; 
            return p;
        });
        this.dispatchPeriodChange();
        this.populate();
    }

    // handleClickNewPart(event) {
    //     this.dispatchNewPart();
    // }

    handleTouchStart(event) {
        this.touchStartX = event.touches[0].clientX;
    }

    handleTouchEnd(event) {
        if(!this.touchStartX) return;
        const touchEndX = event.changedTouches[0].clientX;
        const diff = this.touchStartX - touchEndX;
        this.touchStartX = undefined;
        const threshold = 5;
        if(diff > threshold) {
            this.handleClickRight();
        } else if(diff < -threshold) {
            this.handleClickLeft();
        }
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

        const clickedDateTime = this.addSelectionToPart(event.detail.id);

        // The selection is to be removed from all parts that are on different days.
        // One example purpose: The selection enables multi-drag drop.
        if(this.configuration.preventSelectionOfPartsOfDifferentDays) {
            this.removeSelectionFromPartsOfDifferentDays(clickedDateTime);
        }

        const e = new CustomEvent('partshiftclick', {detail: event.detail});
        this.dispatchEvent(e);
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

    adjustScrollTopOfWeek() {
        const firstDayOfWeek = getFirstDayOfWeek(this.date);
        const lastDayOfWeek = getLastDayOfWeek(this.date);
        const calendarDataWeek = this.calendarData
            .filter(d => d.fromDateTime >= firstDayOfWeek && d.toDateTime <= lastDayOfWeek);
        const earliestHour = this.getEarliestHour(calendarDataWeek);
        this.adjustScrollTop(earliestHour);
    }

    adjustScrollTopOfDay() {
        const earliestTimeOfDay = new Date(this.date);
        earliestTimeOfDay.setHours(0, 0, 0, 0);
        const latestTimeOfDay = new Date(this.date);
        latestTimeOfDay.setHours(23, 59, 59, 999);
        const calendarDataDay = this.calendarData
            .filter(d => d.fromDateTime >= earliestTimeOfDay && d.toDateTime <= latestTimeOfDay);
        const earliestHour = this.getEarliestHour(calendarDataDay);
        this.adjustScrollTop(earliestHour);
    }

    adjustScrollTop(earliestHour) {
        // We use pixels as unit inside, which is good, because it's the same as the required unit for scrollTop.
        // The calendar starts at 19px, each hour requiring 64px. The upper end of the calendar day is always one hour before 
        // the first event of the earliest event of the week.
        const scrollable = this.refs.scrollarea;
        const height = 19 + ((earliestHour - 1) * 64);
        scrollable.scrollTop = height;
    }

    getEarliestHour(calendarDataSubset) {
        // TODO: To make this precisely configurable, we wait until we have a flexible concept of 
        // a configuration in JSON format
        // In case there are no events, we scroll to the START_HOUR
        const START_HOUR = 8;
        // In case the latest events are after 20:00, we scroll to 20:00
        const END_HOUR = 20;
        let earliestHour = calendarDataSubset.length === 0 ? START_HOUR : calendarDataSubset
            .reduce((acc, curr) => curr.fromDateTime.getHours() < acc.fromDateTime.getHours() ? curr : acc)
            .fromDateTime.getHours();
        if(earliestHour > END_HOUR) earliestHour = END_HOUR;
        return earliestHour;
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

    addSelectionToPart(id) {
        const clickedDateTime = getDateTime(id, this.weeks);
        clickedDateTime.selected = !clickedDateTime.selected;
        return clickedDateTime;
    }

    removeSelectionFromPartsOfDifferentDays(clickedDateTime) {
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

        if(this.isMonth || this.isWeek) {
        try {
                const calendarPeriod = new CalendarPeriod(
                    this.configuration.period, this.durations, this.date, this.highlightedDays);
                this.weeks = calendarPeriod.populate();
        } catch (error) {
            console.error('Problem setting up calendar data: ', error);
        }
        } else if(this.isDay) {
            this.day = populateDay(this.date, this.highlightedDays, this.durations);
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
            if(this.isMobile) {
                ar.push({ name: name.substring(0, 1), index: i });
            } else {
            ar.push({ name: name, index: i });
            }
            monday.setDate(monday.getDate() + 1);
        }
        this.weekdays = [...ar];
    }

    populateTitle() {
        if(this.configuration.period === 'day') {
            this.title = this.date.toLocaleDateString();
        } else if(this.configuration.period === 'week') {
            if(this.isDesktop) {
                const firstDayOfWeek = getFirstDayOfWeek(this.date).toLocaleDateString();
                const lastDayOfWeek = getLastDayOfWeek(this.date).toLocaleDateString();
                this.title = firstDayOfWeek + '-' + lastDayOfWeek + ' (' + this.LABEL_WEEK + ' ' + getWeekNumber(this.date) + ')';
            } else {
                this.title = this.LABEL_WEEK + ' ' + getWeekNumber(this.date) + '/' + this.date.getFullYear();
            }
        } else if(this.configuration.period === 'month') {
            const month = this.date.toLocaleString('default', { month: 'long' });
            const year = this.date.getFullYear();
            this.title = month + ' ' + year;
        } else if(this.configuration.period === 'year') {
            this.title = this.date.getFullYear();
        } else {
            // unsupported
        }
    }
}