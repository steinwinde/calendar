export class CalendarOverlapCalculator {

    // TODO: Do not duplicate the durations, but rather add the left and width properties to the original durations.
    #originalDurations;
    #durations;

    constructor(durations) {
        this.#originalDurations = durations;
        this.#durations = durations.map(duration => ({
            id: duration.id,
            start: duration.fromDateTime.getTime(),
            end: duration.toDateTime.getTime()
        }));
    }

    arrange() {
        let columns = [];
        let lastDurationEnd = null;

        for(const duration of this.#durations) {
             if (lastDurationEnd !== null && duration.start >= lastDurationEnd) {
                CalendarOverlapCalculator.arrange( columns );
                columns = [];
                lastDurationEnd = null;
            }

            let pushed = false;
            for(const column of columns) {
                const lastDuration = column[column.length - 1];
                if(lastDuration.end <= duration.start) {
                    column.push(duration);
                    lastDurationEnd = duration.end;
                    pushed = true;
                    break;
                }
            }
            if(!pushed) {
                columns.push([duration]);
                lastDurationEnd = duration.end;
            }
            if (lastDurationEnd === null || duration.end > lastDurationEnd) {
                lastDurationEnd = duration.end;
            }
        }

        if (columns.length > 0) {
            CalendarOverlapCalculator.arrange( columns );
        }

        this.populateOriginalDurations();
    }

    // TODO: Make private
    populateOriginalDurations() {
        this.#originalDurations.forEach(duration => {
            const foundDuration = this.#durations.find(d => d.id === duration.id);
            duration.left = foundDuration.left;
            duration.width = foundDuration.width;
        });
    }

    static arrange(columns) {
        // iterate over columns
        for(let i = 0; i < columns.length; i++) {
            const column = columns[i];
            // iterate over durations
            for(let j = 0; j < column.length; j++) {
                const duration = column[j];
                const columnSpan = CalendarOverlapCalculator.expand(duration, i, columns);
                duration.left = (i / columns.length) * 100;
                duration.width = 100 * columnSpan / columns.length;
            }
        }
    }

    static expand(duration, iColumn, columns) {
        let columnSpan = 1;
        // iterate over columns
        for(let i = iColumn + 1; i < columns.length; i++) {
            const column = columns[i];
            // iterate over durations
            for(let j = 0; j < column.length; j++) {
                const duration1 = column[j];
                if(CalendarOverlapCalculator.collidesWith(duration, duration1)) {
                    return columnSpan;
                }
            }
            columnSpan++;
        }
        return columnSpan;
    }

    static collidesWith(d0, d1) {
        return d0.end > d1.start && d0.start < d1.end;
    }
}