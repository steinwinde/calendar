import { getTimeMarkersForDay } from "../calendarWeekUtils";

// npm run test:unit calendarDateFunctions
describe("c-calendar-week-utils", () => {
    it("getTimeMarkersForDay", () => {
        // Wednesday, 1st of January 2020
        const result = getTimeMarkersForDay();
        expect(result.length).toBe(25);
        expect(result[0].hour).toBe('00:00');
        expect(result[24].index).toBe('hour24');
    });


});