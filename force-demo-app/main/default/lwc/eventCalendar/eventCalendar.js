import { LightningElement, api, track } from 'lwc';
import { getEvents, getPublicHolidays } from './eventCalendarMockData';
import EventCalendarChangeDateModal from 'c/eventCalendarChangeDateModal';
import LightningConfirm from 'lightning/confirm';
import { createPart, movePartsToDate, deletePart, getSchedulerButtonLabel } from './eventCalendarUtils';

// import getEvents from '@salesforce/apex/EventCalendarController.getEvents';
// import getPublicHolidays from "@salesforce/apex/EventCalendarController.getPublicHolidays";

export default class EventCalendar extends LightningElement {

    LABEL_DO_YOU_WANT_TO_DELETE_HEADER = 'Delete part';
    LABEL_DO_YOU_WANT_TO_DELETE = 'Do you really want to delete the part?';
    LABEL_NEW_PART = 'Nouveau';

    // configuration
    @api 
    period = 'month';
    // do not use "readOnly" as a property
    @api 
    isReadOnly = false;
    @api
    leftColumnMonth = false;
    @api 
    leftColumnWeek = false;
    @api
    stackedWeek = false;
    @api
    partHeightFixedMonth = false;
    @api
    partHeightFixedWeek = false;
    @api
    heightFixedMonth = false;
    @api
    heightFixedWeek = false;
    @api
    startHour = 9;
    @api
    scheduler = false;

    publicHolidays;

    configuration = null;

    currentDate = new Date();
    @track
    calendarData = null;

    get displayCalendar() {
        return this.calendarData !== null;
    }

    async connectedCallback() {
        
        this.configuration = {
            period: this.period,
            readOnly: this.isReadOnly,
            leftColumnMonth: this.leftColumnMonth,
            leftColumnWeek: this.leftColumnWeek,
            stackedWeek: this.stackedWeek,
            partHeightFixedMonth: this.partHeightFixedMonth,
            partHeightFixedWeek: this.partHeightFixedWeek,
            heightFixedMonth: this.heightFixedMonth,
            heightFixedWeek: this.heightFixedWeek,
            scheduler: this.scheduler
        };
    
        this.populatePublicHolidays();
        this.refreshCalendar();
    }

    async refreshCalendar() {
        try {
            const events = await getEvents();
            const durations = events.map((e) => {
                const fromDateTime = new Date(e.StartDateTime);
                const toDateTime = new Date(e.EndDateTime);
                const title = this.configuration.scheduler ? getSchedulerButtonLabel(fromDateTime, toDateTime) : e.Subject;
                return {
                    fromDateTime: fromDateTime,
                    toDateTime: toDateTime,
                    id: e.Id,
                    // selected: false,
                    title: title,
                    // give it some varity: meetings appear different
                    type: title.toUpperCase().indexOf('MEET') === -1 ? 'one' : 'two'
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

    async populatePublicHolidays() {
        const year = this.currentDate.getFullYear();
        const result = await getPublicHolidays({ year: year });
        this.publicHolidays = result.map((d) => new Date(d));
    }

    // ------------------------------------------------------------------------
    // User changes something in the calendar, i.e. event comes from child component
    // ------------------------------------------------------------------------

    // Event coming from calendar, calendar becomes based on months instead of weeks or vice versa
    async handlePeriodChange(event) {
        console.log('period changed: ', event.detail);
    }

    // Event coming from calendar, the month or the week changes
    handleDateChange(event) {
        this.currentDate = event.detail;
        this.populatePublicHolidays();
        
        // this.calendarData.date = event.detail;
        // this.calendarData.highlightedDays = [...this.publicHolidays];
        // delete this.calendarData.configuration;
        // this.calendarData = {...this.calendarData};

        this.calendarData = Object.assign({...this.calendarData}, 
            {configuration: undefined, date: event.detail, highlightedDays: [...this.publicHolidays]});
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
            // delete this.calendarData.configuration;
            this.calendarData = createPart(day, this.calendarData, this.startHour);
        }
    }

    async handleDayClick(event) {
        this.calendarData = createPart(event.detail, this.calendarData, this.startHour);
    }

    // Event coming from calendarWeek, one or several "parts" are dragged to a day
    handleDrop(event) {
        const ids = event.detail.ids;
        const day = event.detail.day;
        this.calendarData = movePartsToDate(ids, day, this.calendarData, this.startHour);
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
            this.calendarData = movePartsToDate(event.detail.id, day, this.calendarData, this.startHour);
        }
    }

    async handlePartDoubleClick(event) {
        const result = await LightningConfirm.open({
            message: this.LABEL_DO_YOU_WANT_TO_DELETE,
            variant: 'header',
            label: this.LABEL_DO_YOU_WANT_TO_DELETE_HEADER,
        });
        if(result === true) {
            this.calendarData = deletePart(event.detail, this.calendarData);
        }
    }
}