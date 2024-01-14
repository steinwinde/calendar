import { createElement } from 'lwc';
import EventCalendar from 'c/eventCalendar';
import getPublicHolidays from "@salesforce/apex/EventCalendarController.getPublicHolidays";

const mockPublicHolidays = require("./data/publicHolidays.json");

jest.mock(
    "@salesforce/apex/EventCalendarController.getPublicHolidays",
    () => {
        const {
            createApexTestWireAdapter
        } = require("@salesforce/sfdx-lwc-jest");
        return {
            default: createApexTestWireAdapter(jest.fn())
        };
    },
    { virtual: true }
);

describe('c-event-calendar', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    // async function flushPromises() {
    //     return Promise.resolve();
    // }

    it('eventCalendar instantiate', async () => {

        getPublicHolidays.mockResolvedValue(mockPublicHolidays);

        // await flushPromises();

        const element = createElement('c-event-calendar', {
            is: EventCalendar
        });

        document.body.appendChild(element);

        const elem = element.shadowRoot.querySelectorAll("c-calendar");

        // For now we limit ourselves to verify that the component is created
        expect(elem).not.toBeNull();
    });
});