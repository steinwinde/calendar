import { createElement } from "lwc";
import Calendar from "c/calendar";

// @api
const mockCalendarData = require("./data/calendarData.json");


describe("c-calendar", () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it("calendar", () => {
        const element = createElement("c-calendar", {
            is: Calendar
        });

        document.body.appendChild(element);

        mockCalendarData.durations.forEach((duration) => {
            duration.fromDateTime = new Date(duration.fromDateTime);
            duration.toDateTime = new Date(duration.toDateTime);
        });
        mockCalendarData.date = new Date(mockCalendarData.date);
        mockCalendarData.highlightedDays = mockCalendarData.highlightedDays.map((day) => {
            return new Date(day);
        });
        element.calendarData = mockCalendarData;

        const weekdays = element.shadowRoot.querySelectorAll("div.top-row-element");
        expect(weekdays.length).toBe(7);

        // TODO: switch to week view
        // const weeks = element.shadowRoot.querySelectorAll("c-calendar-week");
        // expect(weeks.length).toBeGreaterThanOrEqual(4);
    });
});
