import { CalendarPeriod } from "../calendarPeriod";

// npm run test:unit calendarPeriod
describe("c-calendar-period", () => {
    it("populateFirstLast monthly", () => {

        const periodOption = 'month';
        const durations = [];
        const date = new Date('2020-01-01T00:00:00.000+01:00');
        const publicHolidays = [];

        const period = new CalendarPeriod(periodOption, durations, date, publicHolidays);
        // Wednesday, 1st of January 2020
        period.populateFirstLast();
        expect(period.firstDayOfPeriod).toStrictEqual(new Date('2020-01-01T00:00:00.000+01:00'));
        expect(period.lastDayOfPeriod).toStrictEqual(new Date('2020-01-31T00:00:00.000+01:00'));
    });

    it("populateFirstLast weekly 0", () => {

        const periodOption = 'week';
        const durations = [];
        // Wednesday, 1st of January 2020
        const date = new Date('2020-01-01T00:00:00.000+01:00');
        const publicHolidays = [];

        const period = new CalendarPeriod(periodOption, durations, date, publicHolidays);
        period.populateFirstLast();
        expect(period.firstDayOfPeriod).toStrictEqual(new Date('2019-12-30T00:00:00.000+01:00'));
        expect(period.firstDayDisplayed).toStrictEqual(new Date('2019-12-30T00:00:00.000+01:00'));
        expect(period.lastDayOfPeriod).toStrictEqual(new Date('2020-01-05T00:00:00.000+01:00'));
        expect(period.lastDayDisplayed).toStrictEqual(new Date('2020-01-05T00:00:00.000+01:00'));
    });

    it("populateFirstLast weekly 1", () => {

        const periodOption = 'week';
        const durations = [];
        // Sunday
        const date = new Date('2023-11-26T00:00:00.000+01:00');
        const publicHolidays = [];

        const period = new CalendarPeriod(periodOption, durations, date, publicHolidays);
        period.populateFirstLast();
        expect(period.firstDayOfPeriod).toStrictEqual(new Date('2023-11-20T00:00:00.000+01:00'));
        expect(period.firstDayDisplayed).toStrictEqual(new Date('2023-11-20T00:00:00.000+01:00'));
        expect(period.lastDayOfPeriod).toStrictEqual(new Date('2023-11-26T00:00:00.000+01:00'));
        expect(period.lastDayDisplayed).toStrictEqual(new Date('2023-11-26T00:00:00.000+01:00'));
    });

});