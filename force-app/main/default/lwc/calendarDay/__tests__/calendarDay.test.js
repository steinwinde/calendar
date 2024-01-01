import { createElement } from "lwc";
import CalendarDay from "c/calendarDay";

// @api
const mockDay = require("./data/day.json");

describe("c-calendar-day", () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it("calendarDay", () => {
        const element = createElement("c-calendar-day", {
            is: CalendarDay
        });

        element.configuration = {
            period: "month",
            readOnly: false
        };

        // const day = mockDay;
        mockDay.day.day = new Date(mockDay.day.day);
        mockDay.day.dateTimes.forEach((dt) => {
            dt.fromDateTime = new Date(dt.fromDateTime);
            dt.toDateTime = new Date(dt.toDateTime);
        });
        element.day = mockDay.day;

        document.body.appendChild(element);

        const parts = element.shadowRoot.querySelectorAll("c-calendar-part");
        expect(parts.length).toBe(1);
    });
});
