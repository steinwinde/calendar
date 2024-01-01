import { getWeek, getFirstDayOfMonth, getLastDayOfWeek } from "../calendarDateFunctions";

// npm run test:unit calendarDateFunctions
describe("c-calendar-date-functions", () => {
    it("getWeek", () => {
        // Wednesday, 1st of January 2020
        const result = getWeek(new Date('2020-01-01'));
        expect(result.length).toBe(7);
        expect(result[0].toDateString()).toBe('Wed Jan 01 2020');
    });

    it("getFirstDayOfMonth 0", () => {
        // Wednesday, 1st of January 2020
        const result = getFirstDayOfMonth(new Date('2020-01-01T00:00:00.000+01:00'));
        const expected = new Date('2020-01-01T00:00:00.000+01:00');
        expect(result).toStrictEqual(expected);
    });

    it("getFirstDayOfMonth 1", () => {
        // Wednesday, 1st of January 2020
        const result = getFirstDayOfMonth(new Date('2020-01-31T00:00:00.000+01:00'));
        const expected = new Date('2020-01-01T00:00:00.000+01:00');
        expect(result).toStrictEqual(expected);
    });

    it("getLastDayOfWeek 0", () => {
        // Wednesday, 1st of January 2020
        const result = getLastDayOfWeek(new Date('2020-01-01T00:00:00.000+01:00'));
        const expected = new Date('2020-01-05T00:00:00.000+01:00');
        expect(result).toStrictEqual(expected);
    });

    // The 26th of November 2023 is a Sunday
    it("getLastDayOfWeek 1", () => {
        // Sunday, 26th of November 2023
        const sunday = '2023-11-26T00:00:00.000+01:00';
        const result = getLastDayOfWeek(new Date(sunday));
        const expected = new Date(sunday);
        expect(result).toStrictEqual(expected);
    });

});