import { CalendarPopulator } from "../calendarPopulator";

// npm run test:unit calendarPopulator
describe("c-calendar-date-functions", () => {
    it("populateFirstLast monthly", () => {

        const periodOption = 'month';
        const durations = [];
        const date = new Date('2020-01-01T00:00:00.000+01:00');
        const publicHolidays = [];

        const populator = new CalendarPopulator(periodOption, durations, date, publicHolidays);
        // Wednesday, 1st of January 2020
        populator.populateFirstLast();
        expect(populator.firstDayOfPeriod).toStrictEqual(new Date('2020-01-01T00:00:00.000+01:00'));
        expect(populator.lastDayOfPeriod).toStrictEqual(new Date('2020-01-31T00:00:00.000+01:00'));
    });

    it("populateFirstLast weekly 0", () => {

        const periodOption = 'week';
        const durations = [];
        // Wednesday, 1st of January 2020
        const date = new Date('2020-01-01T00:00:00.000+01:00');
        const publicHolidays = [];

        const populator = new CalendarPopulator(periodOption, durations, date, publicHolidays);
        populator.populateFirstLast();
        expect(populator.firstDayOfPeriod).toStrictEqual(new Date('2019-12-30T00:00:00.000+01:00'));
        expect(populator.firstDayDisplayed).toStrictEqual(new Date('2019-12-30T00:00:00.000+01:00'));
        expect(populator.lastDayOfPeriod).toStrictEqual(new Date('2020-01-05T00:00:00.000+01:00'));
        expect(populator.lastDayDisplayed).toStrictEqual(new Date('2020-01-05T00:00:00.000+01:00'));
    });

    it("populateFirstLast weekly 1", () => {

        const periodOption = 'week';
        const durations = [];
        // Sunday
        const date = new Date('2023-11-26T00:00:00.000+01:00');
        const publicHolidays = [];

        const populator = new CalendarPopulator(periodOption, durations, date, publicHolidays);
        populator.populateFirstLast();
        expect(populator.firstDayOfPeriod).toStrictEqual(new Date('2023-11-20T00:00:00.000+01:00'));
        expect(populator.firstDayDisplayed).toStrictEqual(new Date('2023-11-20T00:00:00.000+01:00'));
        expect(populator.lastDayOfPeriod).toStrictEqual(new Date('2023-11-26T00:00:00.000+01:00'));
        expect(populator.lastDayDisplayed).toStrictEqual(new Date('2023-11-26T00:00:00.000+01:00'));
    });

});