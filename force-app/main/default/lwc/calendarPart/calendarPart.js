import { LightningElement, api } from 'lwc';
import { getHeight } from './calendarPartUtils';
import calendarPart from './calendarPart.html';
import calendarPartScheduler from './calendarPartScheduler.html';
import FORM_FACTOR from '@salesforce/client/formFactor';

export default class CalendarPart extends LightningElement {

    isMobile = FORM_FACTOR === 'Small';

    @api
    index;

    @api
    title;

    @api
    title2;

    @api
    showIcon;

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

    // Do not remove the following line, i.e. the redundant information about the period
    // If not present, the browser caches the LWC to an extend that the component is not
    // reliably replaced in the DOM. Reproduced: Display a Salarie calendar, navigate to a month
    // with different types of events (planning, temps, intervention), change the view to week
    // and navigate to a week in this month with these different types of events. Then
    // change back to the monthly view and observe events that are still the ones for the 
    // week view.
    @api
    period;

    @api
    type;

    @api
    fontType;

    @api
    selected = false;

    get isMonth() {
        return this.configuration?.period === 'month';
    }

    get isWeek() {
        return this.configuration?.period === 'week';
    }

    get isDay() {
        return this.configuration?.period === 'day';
    }

    // get title2() {
    //     const fromTime = getTimeStamp(this.fromDateTime)
    //     const toTime = getTimeStamp(this.toDateTime);
    //     return fromTime + ' - ' + toTime;
    // }

    get dataId() {
        // Do not remove the following line. For explanations see period declaration above
        return this.fromDateTime.toISOString().substring(0, 10) + '-' + this.period;
    }

    get draggable() {
        return !this.configuration?.readOnly;
    }

    get hasFixedHeight() {
        return (this.configuration?.period === 'month' && this.configuration?.partHeightFixedMonth === true)
            || (this.configuration?.period === 'week' && this.configuration?.partHeightFixedWeek === true)
            || (this.configuration?.period === 'day' && this.configuration?.partHeightFixedDay === true);
    }

    get classDivMain() {

        // Do not remove the following line. Even adding setter/getter to "@api configuration" did not prevent
        // the browser from caching this LWC to an extend that the classDiv() getter was not called reliably (for all parts)
        // after changing from month to week view. Mentioning this.index here achieves this.
        this.index;


        let arrangementClass = 'positioned';
        if(this.isWeek && this.configuration?.stackedWeek) { arrangementClass = 'stackedWeek'; }
        else if(this.isDay && this.configuration?.stackedDay) { arrangementClass = 'stackedDay'; }

        const markSelectedClass = this.selected ? 'selected' : '';

        const main = this.configuration?.scheduler ? 'slds-m-top_small' : 'main';

        // type is "one", "two"...
        const typeClass = this.type;

        let heightClass = this.hasFixedHeight ? 'fixedHeight' :'';

        return `title ${main} ${arrangementClass} ${markSelectedClass} ${typeClass} ${heightClass}`;
    }

    get styleDiv() {
        if(this.isMonth || (this.isWeek && this.configuration.stackedWeek) || (this.isDay && this.configuration?.stackedDay)) return '';

        let heightStyle = '';
        if(!this.hasFixedHeight) {
            const height = getHeight(this.fromDateTime, this.toDateTime);
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

    // e.g. three==done; four==ongoing; one==startable
    get schedulerButtonVariant() {
        return (this.type === 'four' || this.type === 'two') ? 'brand' : (this.type === 'three' ? 'success' : 'neutrale');
    }

    get schedulerButtonDisabled() {
        return (this.type === 'four' || this.type === 'two') ? false : (this.type === 'three' ? true : false);
    }

    get schedulerButtonStretch() {
        return this.isMobile;
    }

    // }

    // ------------------------------------------------------------------------
    // lifecycle hooks
    // ------------------------------------------------------------------------

    render() {
        if(this.configuration?.schedulerWeek && this.configuration?.period === 'week'
                || this.configuration?.schedulerDay && this.configuration?.period === 'day'
        ) {
            return calendarPartScheduler;
        }
        
        return calendarPart;
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