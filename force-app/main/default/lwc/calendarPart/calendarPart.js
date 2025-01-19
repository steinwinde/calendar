import { LightningElement, api } from 'lwc';
import { getHeight, getTimeStamp } from './calendarPartUtils';
import calendarPart from './calendarPart.html';
import calendarPartScheduler from './calendarPartScheduler.html';

export default class CalendarPart extends LightningElement {

    @api
    index;

    @api
    title;

    @api
    title2;

    @api
    fromDateTime = null;

    @api
    toDateTime = null;

    @api
    left = 0;

    @api
    width = 0;

    @api
    configuration;

    @api
    type;

    @api
    selected = false;

    // get title2() {
    //     const fromTime = getTimeStamp(this.fromDateTime)
    //     const toTime = getTimeStamp(this.toDateTime);
    //     return fromTime + ' - ' + toTime;
    // }

    get draggable() {
        return !this.configuration.readOnly;
    }

    get hasFixedHeight() {
        return (this.configuration?.period === 'month' && this.configuration?.partHeightFixedMonth === true)
            || (this.configuration?.period === 'week' && this.configuration?.partHeightFixedWeek === true);
    }

    get classDivMain() {
        const isMonth = this.configuration.period === 'month';

        const arrangementClass = !isMonth && !this.configuration.stackedWeek ? 'positioned' : 'stackedWeek';

        const markSelectedClass = this.selected ? 'selected' : '';

        // type is "one", "two"...
        const typeClass = this.type;

        let heightClass = this.hasFixedHeight ? 'fixedHeight' :'';

        return 'title main ' + arrangementClass + ' ' + markSelectedClass + ' ' + typeClass + ' ' + heightClass;
    }

    get styleDiv() {
        const isMonth = this.configuration.period === 'month';
        if(isMonth || this.configuration.stackedWeek) return '';

        let heightStyle = '';
        if(!this.hasFixedHeight) {
            const height = getHeight(this.configuration, this.fromDateTime, this.toDateTime);
            heightStyle = `height: ${height}rem;`;
        }

        // TODO: In the wild, we use 6 now
        const factor = 4;
        const shiftSpace = 0;
        const position = (this.fromDateTime.getHours() + (this.fromDateTime.getMinutes() / 60) - shiftSpace) * factor;
        const positionStyle = `margin-top: ${position}rem;`;

        // Adjust "width" and "left" depending on overlapping parts
        const horizontalPositionStyle = `left: ${this.left}%;`;
        const widthStyle = `width: ${this.width}%;`;

        const result = heightStyle + positionStyle + horizontalPositionStyle + widthStyle;
        return result;
    }

    // get styleDivP() {
        // if(this.configuration?.period === 'month' && this.configuration?.partHeightFixedMonth === true) {
        //     return 'height: 3rem; text-overflow: ellipsis;';
        // } else if(this.configuration?.period === 'week' && this.configuration?.partHeightFixedWeek === true) {
        //     return 'height: 3rem; text-overflow: ellipsis;';
        // }
        // return '';
    // }

    // ------------------------------------------------------------------------
    // lifecycle hooks
    // ------------------------------------------------------------------------

    render() {
        return this.configuration?.scheduler ? calendarPartScheduler : calendarPart;
    }

    // ------------------------------------------------------------------------
    // events of this component
    // ------------------------------------------------------------------------

    timer;

    async handleClick(event) {
        event.stopPropagation();
        if (this.configuration.readOnly) return;
        if (event.detail === 1) {
            if(event.shiftKey) {
                // the "selected" property is updated from the parent(s) LWC 
                this.dispatchSimpleEvent('partshiftclick');
            } else {
                clearTimeout(this.timer);
                // eslint-disable-next-line @lwc/lwc/no-async-operation
                this.timer = setTimeout(() => {
                    this.dispatchSimpleEvent('partclick');
                }, 500);
            }
        }
    }

    handleDoubleClick(event) {
        if (this.configuration.readOnly) return;
        event.stopPropagation();
        clearTimeout(this.timer);
        this.dispatchSimpleEvent('partdoubleclick');
    }

    handleDragStart(event) {
        if (this.configuration.readOnly) return;
        event.dataTransfer.setData('text/plain', this.index);
        event.dataTransfer.dropEffect = 'move';
    }

    // ----------------------------------------------------------------------------------------------------------------

    dispatchSimpleEvent(eventName) {
        const e = new CustomEvent(eventName, { detail: {id: this.index} });
        this.dispatchEvent(e);
    }
}