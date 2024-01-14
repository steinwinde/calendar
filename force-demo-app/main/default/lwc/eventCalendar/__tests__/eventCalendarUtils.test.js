import { createPart, movePartToDate, deletePart } from "../eventCalendarUtils";

describe("c-event-calendar-utils", () => {
    it("createPart", () => {
        
        const day = new Date('2020-01-01');
        const durations = [
            {fromDateTime: new Date('2020-01-01T09:00:00.000+01:00'), toDateTime: new Date('2020-01-01T10:00:00.000+01:00'), id: '1'},
        ];
        const calendarData = {durations: durations};

        const startHour = 9;
        const result = createPart(day, calendarData, startHour);

        expect(result.durations.length).toBe(2);
        expect(result.durations[1].fromDateTime.toDateString()).toBe('Wed Jan 01 2020');
    });

    it("movePartToDate", () => {

        const id = '1';
        const day = new Date('2020-01-02');
        const durations = [
            {fromDateTime: new Date('2020-01-01T09:00:00.000+01:00'), toDateTime: new Date('2020-01-01T10:00:00.000+01:00'), id: '1'},
        ];
        const calendarData = {durations: durations};
        const startHour = 9;

        const result = movePartToDate(id, day, calendarData, startHour);

        expect(result.durations.length).toBe(1);
        expect(result.durations[0].fromDateTime.toDateString()).toBe('Thu Jan 02 2020');
    });

    it("deletePart", () => {

        const id = '1';
        const durations = [
            {fromDateTime: new Date('2020-01-01T09:00:00.000+01:00'), toDateTime: new Date('2020-01-01T10:00:00.000+01:00'), id: '1'},
        ];
        const calendarData = {durations: durations};

        const result = deletePart(id, calendarData);

        expect(result.durations.length).toBe(0);
    });
});