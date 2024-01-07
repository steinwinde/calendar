import { LightningElement, api, track } from "lwc";
import { getFirstDayOfWeek, getLastDayOfWeek, getWeekNumber } from "./calendarDateFunctions";
import {CalendarPopulator} from "./calendarPopulator";
import { CalendarOverlapCalculator } from "./calendarOverlapCalculator";

export default class Calendar extends LightningElement {

    LABEL_ALTERNATIVE_TEXT_PREVIOUS = 'précédent';
    LABEL_ALTERNATIVE_TEXT_NEXT = 'suivant';
    LABEL_CALENDAR = 'Calendar';
    LABEL_MONTH = 'Mois';
    LABEL_WEEK = 'Semaine';
    LABEL_TODAY = 'Aujourd\'hui';
    LABEL_ALTERNATIVE_TEXT_REFRESH = 'Mettre à jour';
    LABEL_VIEW = 'Vue';
    LABEL_NEW_PART = 'Nouveau';

    // defaults
    configuration = {
        period: 'month',
        readOnly: false
    };
    durations = [];
    date = new Date();
    highlightedDays = [];

    @api
    get calendarData() {
        return null;
    }
    set calendarData(value) {
        if (value) {
            
            [this.date, this.highlightedDays] = [value.date, value.highlightedDays];
            
            // We need the durations to be sorted by start and end date, e.g. for the overlap calculation
            this.durations = value.durations.map(d => ({...d})).sort((d1, d2) => {
                if (d1.fromDateTime.getTime() < d2.fromDateTime.getTime()) return -1;
                if (d1.fromDateTime.getTime() > d2.fromDateTime.getTime()) return 1;
                if (d1.toDateTime.getTime() < d2.toDateTime.getTime()) return -1;
                if (d1.toDateTime.getTime() > d2.toDateTime.getTime()) return 1;
                return 0;
            });
            new CalendarOverlapCalculator(this.durations).arrange();

            // We currently don't support changing the configuration on the fly
            if(!this.configuration && value.configuration) {
                this.configuration = {...value.configuration};
            }
        }
        this.populate();
    }

    // TODO: track used to be necessary, otherwise the later coming addition of public holidays does not trigger a refresh
    @track
    weeks = []; // calendar data passed to child LWCs
    weekdays = []; // 7 weekdays like LU, MA, ...
    title = "";

    @track
    periods = [
        { checked: true, label: this.LABEL_MONTH, value: "month" },
        { checked: false, label: this.LABEL_WEEK, value: "week" }
    ];

    get isWeek() {
        return this.configuration?.period === 'week';
    }

    get classWeekDayRow() {
        return this.isWeek ? "week-day-row grid-columns-hidden-column" : "week-day-row grid-columns-regular";
    }

    get classCalendarRows() {
        return this.isWeek ? "calendar-rows-week" : "calendar-rows-month";
    }

    get classScrolledArea() {
        return this.isWeek ? "scrolled-area-week" : "scrolled-area-month";
    }

    connectedCallback() {
        this.populateWeekDays();
    }

    renderedCallback() {
        if(this.isWeek) {
            // TODO: Do we need to hedge against repeated execution of this section? How can we, still guaranteeing
            // we scroll as much as needed? (Compare old against new period?!)
            const scrollable = this.refs.scrollarea;
            const height = scrollable.offsetHeight;
            // TODO: Make scroll to specific time
            scrollable.scrollTop = height;
        }
    }

    // ------------------------------------------------------------------------
    // event handlers from this component
    // ------------------------------------------------------------------------

    handleClickLeft(event) {
        if(this.isWeek) {
            this.date.setDate(this.date.getDate() - 7);
        } else {
            const d = this.date.setMonth(this.date.getMonth() - 1);
            this.date = new Date(d);
        }
        this.dispatchDateChange(this.date);
    }

    handleClickRight(event) {
        if(this.isWeek) {
            this.date.setDate(this.date.getDate() + 7);
        } else {
            const d = this.date.setMonth(this.date.getMonth() + 1);
            this.date = new Date(d);
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
        this.periods = this.periods.map((p) => {p.checked = p.value === this.configuration.period; return p;});
        this.dispatchPeriodChange();
        this.populate();
    }

    handleClickNewPart(event) {
        this.dispatchNewPart();
    }

    // ------------------------------------------------------------------------
    // events of this component
    // ------------------------------------------------------------------------

    dispatchDateChange(d) {
        const e = new CustomEvent("datechange", {detail: d});
        this.dispatchEvent(e);
    }

    dispatchPeriodChange() {
        const e = new CustomEvent("periodchange", {detail: this.configuration.period});
        this.dispatchEvent(e);
    }
    
    dispatchNewPart() {
        const e = new CustomEvent("newpart");
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
        const e = new CustomEvent('partdoubleclick', {detail: event.detail});
        this.dispatchEvent(e);
    }

    handleOnDrop(event) {
        console.log("Got event date: ", event.detail.day);
        const e = new CustomEvent('drop', {detail: event.detail});
        this.dispatchEvent(e);
    }

    // ------------------------------------------------------------------------
    // general functions
    // ------------------------------------------------------------------------

    populate() {
        if (!this.date) return;
        try {
            const populator = new CalendarPopulator(
                this.configuration.period, this.durations, this.date, this.highlightedDays);
            this.weeks = populator.populate();
        } catch (error) {
            console.error("Problem setting up calendar data: ", error);
        }
        this.populateTitle();
        console.log("weeks: ", this.weeks.length);
    }

    populateWeekDays() {
        const options = { weekday: "short" };
        const monday = new Date("1970-01-05");
        const ar = [];
        for (let i = 0; i < 7; i++) {
            const name = monday
                .toLocaleDateString(undefined, options)
                .toUpperCase();
            ar.push({ name: name, index: i });
            monday.setDate(monday.getDate() + 1);
        }
        this.weekdays = [...ar];
    }

    populateTitle() {
        if(this.configuration.period === 'month') {
            const month = this.date.toLocaleString("default", { month: "long" });
            const year = this.date.getFullYear();
            this.title = month + " " + year;
        } else {
            const firstDayOfWeek = getFirstDayOfWeek(this.date).toLocaleDateString();
            const lastDayOfWeek = getLastDayOfWeek(this.date).toLocaleDateString();
            this.title = firstDayOfWeek + "-" + lastDayOfWeek + " (" + this.LABEL_WEEK + " " + getWeekNumber(this.date) + ")";
        }
    }
}