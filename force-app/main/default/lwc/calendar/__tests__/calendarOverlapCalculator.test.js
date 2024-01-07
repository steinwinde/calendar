import { CalendarOverlapCalculator } from "../calendarOverlapCalculator";

describe("c-calendar-overlap-calculator", () => {

    function getTime(hour, minute) {
        const time = new Date('2000-01-01T00:00:00.000');
        time.setHours(hour);
        time.setMinutes(minute);
        return time;
    }

    it("arrangeEvents Two consecutive, a third overlapping the second, a fourth consecutive again", () => {
        const durations = [
            {fromDateTime: getTime(10, 0), toDateTime: getTime(14, 0), id: '1'},
            {fromDateTime: getTime(14, 0), toDateTime: getTime(19, 0), id: '2'},
            {fromDateTime: getTime(17, 0), toDateTime: getTime(19, 0), id: '3'},
            {fromDateTime: getTime(19, 0), toDateTime: getTime(19, 30), id: '4'}
        ];

        new CalendarOverlapCalculator(durations).arrange();

        expect(durations[0].width).toStrictEqual(100);
        expect(durations[0].left).toStrictEqual(0);
        expect(durations[1].width).toStrictEqual(50);
        expect(durations[1].left).toStrictEqual(0);
        expect(durations[2].width).toStrictEqual(50);
        expect(durations[2].left).toStrictEqual(50);
        expect(durations[3].width).toStrictEqual(100);
        expect(durations[3].left).toStrictEqual(0);
    })

    it("arrangeEvents Two overlapping; the third starting after the first but fully ending before the second (i.e. column 0); "
        + "the fourth overlapping the third (i.e. column 4).", () => {
        const durations = [
            {fromDateTime: getTime(10, 0), toDateTime: getTime(11, 0), id: '1'},
            {fromDateTime: getTime(10, 10), toDateTime: getTime(18, 0), id: '2'},
            {fromDateTime: getTime(11, 30), toDateTime: getTime(12, 30), id: '3'},
            {fromDateTime: getTime(11, 40), toDateTime: getTime(12, 40), id: '4'}
        ];

        new CalendarOverlapCalculator(durations).arrange();

        expect(durations[0].width).toBeCloseTo(33.33, 2);
        expect(durations[0].left).toStrictEqual(0);
        expect(durations[1].width).toBeCloseTo(33.33, 2);
        expect(durations[1].left).toBeCloseTo(33.33, 2);
        expect(durations[2].width).toBeCloseTo(33.33, 2);
        expect(durations[2].left).toStrictEqual(0);
        expect(durations[3].width).toBeCloseTo(33.33, 2);
        expect(durations[3].left).toBeCloseTo(66.67, 2);
    })

    it("arrangeEvents Three overlapping; three more overlapping, but so that they still partially fit into the existing", () => {
        const durations = [
            {fromDateTime: getTime(8, 0), toDateTime: getTime(10, 0), id: '1'},
            {fromDateTime: getTime(8, 10), toDateTime: getTime(10, 10), id: '2'},
            {fromDateTime: getTime(8, 20), toDateTime: getTime(10, 20), id: '3'},

            {fromDateTime: getTime(10, 10), toDateTime: getTime(11, 10), id: '4'},
            {fromDateTime: getTime(10, 20), toDateTime: getTime(11, 20), id: '5'},
            {fromDateTime: getTime(10, 30), toDateTime: getTime(11, 30), id: '6'}
        ];

        new CalendarOverlapCalculator(durations).arrange();
   
        expect(durations[0].width).toBeCloseTo(33.33, 2);
        expect(durations[0].left).toStrictEqual(0);
        expect(durations[1].width).toBeCloseTo(33.33, 2);
        expect(durations[1].left).toBeCloseTo(33.33, 2);
        expect(durations[2].width).toBeCloseTo(33.33, 2);
        expect(durations[2].left).toBeCloseTo(66.67, 2);

        expect(durations[3].width).toBeCloseTo(33.33, 2);
        expect(durations[3].left).toStrictEqual(0);
        expect(durations[4].width).toBeCloseTo(33.33, 2);
        expect(durations[4].left).toBeCloseTo(33.33, 2);
        expect(durations[5].width).toBeCloseTo(33.33, 2);
        expect(durations[5].left).toBeCloseTo(66.67, 2);
    })

});