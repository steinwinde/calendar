import { createElement } from "lwc";
import CalendarWeek from "c/calendarWeek";

// @api
const mockWeek = require("./data/week.json");

describe("c-calendar-week", () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it("calendarWeek", () => {
        const element = createElement("c-calendar-week", {
            is: CalendarWeek
        });
        mockWeek.days.forEach((elem) => {
            elem.day = new Date(elem.day);
            elem.dateTimes.forEach((dateTime) => {
                dateTime.fromDateTime = new Date(dateTime.fromDateTime);
                dateTime.toDateTime = new Date(dateTime.toDateTime);
            });
        });
        element.week = mockWeek;
        element.configuration = {
            period: "week",
            readOnly: false
        };

        document.body.appendChild(element);

        const days = element.shadowRoot.querySelectorAll("c-calendar-day");
        expect(days.length).toBe(7);
    });
});
