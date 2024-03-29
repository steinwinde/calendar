import { LightningElement, api } from 'lwc';

export default class CalendarDay extends LightningElement {

    @api
    configuration;

    @api
    day;

    get parts() {
        const ar = [];
        // TODO: This is a cumbersome way to avoid items are sometimes cached. Notedly this happens when the only change is 
        // the periods attribute of the configuration - so we probably could alternatively pass the
        // configuration attributes as such into this LWC instead of the whole configuration). In that case the
        //  "part" is not updated, i.e. the constructor and the getters of the LWC are not called. If the 
        // items have new keys, they are not cached.
        const millis = '' + new Date().getTime();
        this.day.dateTimes.forEach((dt, index) => {
            // TODO: Utilize the incoming "id" attribute
            ar.push({
                fromDateTime: dt.fromDateTime, 
                // becomes "index" in calendarPart LWC
                id: dt.id,
                // key of iterator in markup
                index: millis + index,
                left: dt.left,
                selected: dt.selected,
                title: dt.title, 
                title2: dt.title2, 
                toDateTime: dt.toDateTime,
                type: dt.type,
                width: dt.width
            });
        });
        return ar;
    }

    get number() {
        const d = this.day.day.getDate();
        return d;
    }

    get isMonth() {
        return this.configuration?.period === 'month';
    }

    get isWeek() {
        return this.configuration?.period === 'week';
    }

    get classContainer() {
        if(this.isWeek && this.configuration?.leftColumnWeek) {
            return 'show-lines';
        }
        return 'container';
    }


    get styleContainer() {

        let heightStyle = '';
        if(this.isWeek && (this.configuration?.leftColumnWeek || !this.configuration?.stackedWeek)) {
            // decides the height of the background e.g. of a weekend day; 32.1rem is the height for a day from
            // 00:00 to 08:00
            heightStyle = 'height: 96.3rem;';
        } else {
            const hasFixedHeight = (this.isMonth && this.configuration?.heightFixedMonth === true)
                || (this.isWeek && this.configuration?.heightFixedWeek === true);
            heightStyle = hasFixedHeight ? 'height: 9.6rem;' : 'min-height: 9.6rem;';
        }

        // when calendar height is fixed and stacking used (and if there are many parts), overflow-hidden guarantees 
        // parts don't reach outside the day
        const hasFixedHeight = (this.isMonth && this.configuration?.heightFixedMonth === true)
            // || (this.isWeek && this.configuration?.heightFixedWeek === true && this.configuration?.stackedWeek === true)
            ;
        const overflowStyle = hasFixedHeight ? 'overflow: hidden;' : '';

        return heightStyle + ' ' + overflowStyle;
    }

    // ------------------------------------------------------------------------
    // events of this component
    // ------------------------------------------------------------------------

    // Works only for dates that are not booked
    async handleClick(event) {
        if(this.configuration.readOnly) return;
        const day = new Date(this.day.day.getTime());
        const e = new CustomEvent('dayclick', {detail: day});
        this.dispatchEvent(e);
    }

    handleOnDragOver(event) {
        event.preventDefault();
        if(this.configuration.readOnly) return;
        event.dataTransfer.dropEffect = 'move';
    }

    handleOnDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        if(this.configuration.readOnly) return;
        const id = event.dataTransfer.getData('text/plain');
        // maybe overdoing it, but avoiding passing on the Date object used by the module
        const day = new Date(this.day.day.getTime());
        const e = new CustomEvent('drop', {
            detail: {
                day: day,
                id: id
            }
        });
        this.dispatchEvent(e);
    }

    // ------------------------------------------------------------------------
    // event handlers of events from other components
    // ------------------------------------------------------------------------

    handlePartClick(event) {
        const e = new CustomEvent('partclick', {detail: event.detail});
        this.dispatchEvent(e);
    }

    handlePartDoubleClick(event) {
        const e = new CustomEvent('partdoubleclick', {detail: event.detail});
        this.dispatchEvent(e);
    }

    handlePartShiftClick(event) {
        const e = new CustomEvent('partshiftclick', {detail: event.detail});
        this.dispatchEvent(e);
    }
}