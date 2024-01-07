import { LightningElement, api } from 'lwc';

export default class CalendarDay extends LightningElement {

    @api
    configuration;

    @api
    day;

    get parts() {
        const ar = [];
        // This is a cumbersome way to avoid that items are sometimes (notedly when the only change is 
        // the periods attribute of the configuration - so we probably could alternatively pass the
        // configuration attributes as such into this LWC instead of the whole configuration) cached (the
        //  "part" is not updated, i.e. the constructor and the getters of the LWC are not called). If the 
        // items have new keys, they are not cached.
        const millis = '' + new Date().getTime();
        this.day.dateTimes.forEach((dt, index) => {
            ar.push({
                fromDateTime: dt.fromDateTime, 
                id: dt.id,
                index: millis + index,
                left: dt.left,
                title: dt.title, 
                toDateTime: dt.toDateTime,
                width: dt.width
            });
        });
        return ar;
    }

    get number() {
        const d = this.day.day.getDate();
        return d;
    }

    get classContainer() {
        if(this.configuration.period === 'week') {
            return 'show-lines';
        }
        return 'container';
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
}