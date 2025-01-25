import { LightningElement, api } from 'lwc';
import FORM_FACTOR from '@salesforce/client/formFactor';


export default class CalendarDay extends LightningElement {

    @api
    configuration;

    @api
    day;

    // if in week view, the minimum columns are given based on the columns that exist in the week
    @api
    columns = [];

    isMobile = FORM_FACTOR === 'Small';
    isDesktop = FORM_FACTOR === 'Large' || FORM_FACTOR === 'Medium';

    get dataId() {
        return new Date(this.day.day).toISOString().substring(0, 10)
            + '-' + this.configuration.period;
    }

    get parts() {
        return this.getParts();
    }

    get number() {
        const d = this.day.day.getDate();
        return d;
    }

    get showNumber() {
        return this.configuration?.period !== 'day';
    }

    get classDayCounter() {
        if(this.isDesktop) {
            return 'background-day-counter';
        }
        return 'background-day-counter-mobile';
    }

    get isMonth() {
        return this.configuration?.period === 'month';
    }

    get isWeek() {
        return this.configuration?.period === 'week';
    }

    get isDay() {
        return this.configuration?.period === 'day';
    }

    get classContainer() {
        // TODO: To make this precisely configurable, we wait until we have a flexible concept of 
        // a configuration in JSON format
        if(!this.isMobile && ((this.isWeek && this.configuration?.leftColumnWeek) 
                || (this.isDay && this.configuration?.leftColumnDay))) {
            return 'show-lines';
        }
        return 'container';
    }


    // get styleContainer() {
    //     // TODO: All this is very different from what we currently use
    //     let heightStyle = '';
    //     if(this.isWeek && (this.configuration?.leftColumnWeek || !this.configuration?.stackedWeek)) {
    //         // decides the height of the background e.g. of a weekend day; 
    //         heightStyle = 'height: 96.3rem;';
    //     } else {
    //         const hasFixedHeight = (this.isMonth && this.configuration?.heightFixedMonth === true)
    //             || (this.isWeek && this.configuration?.heightFixedWeek === true);
    //         heightStyle = hasFixedHeight ? 'height: 9.6rem;' : 'min-height: 9.6rem;';
    //     }

    //     // when calendar height is fixed and stacking used (and if there are many parts), overflow-hidden guarantees 
    //     // parts don't reach outside the day
    //     const hasFixedHeight = (this.isMonth && this.configuration?.heightFixedMonth === true)
    //         // || (this.isWeek && this.configuration?.heightFixedWeek === true && this.configuration?.stackedWeek === true)
    //         ;
    //     const overflowStyle = hasFixedHeight ? 'overflow: hidden;' : '';

    //     return heightStyle + ' ' + overflowStyle;
    // }

    // 32.1rem is the height for a day from 00:00 to 08:00
    get styleContainer() {
        let heightStyle = '';
        // when calendar height is fixed and stacking used (and if there are many parts), overflow-hidden guarantees 
        // parts don't reach outside the day
        let overflowStyle = '';
        if(this.isDay) {
            if(this.configuration?.leftColumnDay || !this.configuration?.stackedDay) {
                if(this.configuration?.heightFixedDay === true) {
                    overflowStyle = 'overflow: hidden;';
                    heightStyle = 'height: 96.3rem;';
                } else {
                    heightStyle = 'min-height: 96.3rem;';
                }
            }
        } else if(this.isWeek) {
            if(this.configuration?.leftColumnWeek || !this.configuration?.stackedWeek) {
                if(this.configuration?.heightFixedWeek === true) {
                    overflowStyle = 'overflow: hidden;';
                    heightStyle = 'height: 96.3rem;';
                } else {
                    heightStyle = 'min-height: 96.3rem;';
                }
            }
        } else if(this.isMonth) {
            if(this.configuration?.heightFixedMonth === true) {
                overflowStyle = 'overflow: hidden;';
                heightStyle = 'height: 9.6rem;';
            } else {
                heightStyle = 'min-height: 9.6rem;';
            }
        }

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

    // ------------------------------------------------------------------------
    // private functions
    // ------------------------------------------------------------------------

    getParts() {
        const resultParts = [];
        // TODO: This is a cumbersome way to avoid items are sometimes cached. Notedly this happens when the only change is 
        // the periods attribute of the configuration - so we probably could alternatively pass the
        // configuration attributes as such into this LWC instead of the whole configuration). In that case the
        //  "part" is not updated, i.e. the constructor and the getters of the LWC are not called. If the 
        // items have new keys, they are not cached.
        const millis = '' + new Date().getTime();
        this.day.dateTimes.forEach((dt, index) => {
            // TODO: Utilize the incoming "id" attribute
            const element = this.getElement(dt, millis, index);
            resultParts.push(element);
        });
        return resultParts;
    }

    getElement(dt, millis, index) {
        return {
            fontType: dt.fontType,
            fromDateTime: dt.fromDateTime, 
            // becomes "index" in calendarPart LWC
            id: dt.id,
            // key of iterator in markup
            index: millis + index,
            left: dt.left,
            selected: dt.selected,
            popupTitle: dt.popupTitle,
            popupContent: dt.popupContent,
            showIcon: dt.showIcon,
            title: dt.title, 
            title2: dt.title2, 
            toDateTime: dt.toDateTime,
            type: dt.type,
            width: dt.width
        }
    }
}