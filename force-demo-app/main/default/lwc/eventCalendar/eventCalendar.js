import { LightningElement, api, track } from 'lwc';
import { getEvents, getPublicHolidays } from './eventCalendarMockData';
import EventCalendarChangeDateModal from 'c/eventCalendarChangeDateModal';
import LightningConfirm from 'lightning/confirm';
import { createPart, movePartToDate, deletePart } from './eventCalendarUtils';

// import getEvents from '@salesforce/apex/EventCalendarController.getEvents';
// import getPublicHolidays from "@salesforce/apex/EventCalendarController.getPublicHolidays";

export default class EventCalendar extends LightningElement {

    LABEL_DO_YOU_WANT_TO_DELETE_HEADER = 'Delete part';
    LABEL_DO_YOU_WANT_TO_DELETE = 'Do you really want to delete the part?';

    START_HOUR = 9;

    @api period;
    // do not use "readOnly" as a property
    @api isReadOnly;

    publicHolidays;

    get configuration() {
        return {
            period: this.period,
            readOnly: this.isReadOnly
        };
    }

    currentDate = new Date();
    @track
    calendarData = null;

    get displayCalendar() {
        return this.calendarData !== null;
    }

    async connectedCallback() {
        const result = await getPublicHolidays({ d: this.currentDate });
        this.publicHolidays = result.map((d) => new Date(d));
        this.refreshCalendar();
    }

    async refreshCalendar() {
        try {
            const events = await getEvents();
            let durations = events.map((e) => {
                const fromDateTime = new Date(e.StartDateTime);
                const toDateTime = new Date(e.EndDateTime);
                return {
                    fromDateTime: fromDateTime,
                    toDateTime: toDateTime,
                    id: e.Id,
                    title: e.Subject,
                    type: 'event'
                };
            });

            const erroneous = durations.filter((duration) => 
                !duration.fromDateTime || !duration.toDateTime || duration.fromDateTime > duration.toDateTime);
            if (erroneous.length > 0) {
                console.error('Erroneous durations: ', erroneous);
                throw new Error('Erroneous durations');
            }

            this.calendarData = {
                date: this.currentDate,
                durations: durations,
                highlightedDays: this.publicHolidays,
                configuration: this.configuration
            };
        } catch(error) {
            console.error('Could not fetch events: ', error);
        }
    }

    // ------------------------------------------------------------------------
    // User changes something in the calendar, i.e. event comes from child component
    // ------------------------------------------------------------------------

    // Event coming from calendarWeek, calendar becomes based on months instead of weeks or vice versa
    async handlePeriodChange(event) {
        console.log('period changed: ', event.detail);
    }

    // Event coming from calendarWeek, the month or the week changes
    handleDateChange(event) {
        this.currentDate = event.detail;
        this.calendarData.date = this.currentDate;
        this.calendarData = {...this.calendarData};
    }

    async handleNewPart(event) {
        const d = new Date().toISOString().substring(0, 10);
        const result = await EventCalendarChangeDateModal.open({
            description: 'Change date of part',
            index: null,
            d: d,
            size: 'small'
        });
        if(result) {
            const day= new Date(result);
            this.calendarData = createPart(day, this.calendarData, this.START_HOUR);
        }
    }

    async handleDayClick(event) {
        this.calendarData = createPart(event.detail, this.calendarData, this.START_HOUR);
    }

    // Event coming from calendarWeek, a "Part" is dragged to a day
    handleDrop(event) {
        const id = event.detail.id;
        const day = event.detail.day;
        this.calendarData = movePartToDate(id, day, this.calendarData, this.START_HOUR);
    }

    // Event coming from calendarWeek, a "Part" is clicked; we could open a modal here to edit the "Part"
    async handlePartClick(event) {
        const durationToChange = this.calendarData.durations.find((duration) => duration.id === event.detail.id);
        const d = durationToChange.fromDateTime.toISOString().substring(0, 10);
        const result = await EventCalendarChangeDateModal.open({
            description: 'Change date of part',
            index: event.detail.id,
            d: d,
            size: 'small'
        });
        if(result) {
            const day= new Date(result);
            this.calendarData = movePartToDate(event.detail.id, day, this.calendarData, this.START_HOUR);
        }
    }

    async handlePartDoubleClick(event) {
        const result = await LightningConfirm.open({
            message: this.LABEL_DO_YOU_WANT_TO_DELETE,
            variant: 'header',
            label: this.LABEL_DO_YOU_WANT_TO_DELETE_HEADER,
        });
        if(result === true) {
            this.calendarData = deletePart(event.detail.id, this.calendarData);
        }
    }
}