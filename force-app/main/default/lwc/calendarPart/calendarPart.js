import { LightningElement, api } from 'lwc';
import { getHeight } from './calendarPartUtils';

export default class CalendarPart extends LightningElement {

    @api
    index;

    @api
    title;

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

    get draggable() {
        return !this.configuration.readOnly;
    }

    get classDiv() {
        const isMonth = this.configuration.period === 'month';
        return !isMonth ? 'positioned' : 'stacked';
    }

    get styleDiv() {
        const isMonth = this.configuration.period === 'month';
        if(isMonth) return '';

        const height = getHeight(this.configuration, this.fromDateTime, this.toDateTime);
        const heightStyle = `height: ${height}rem;`;

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

    // ------------------------------------------------------------------------
    // events of this component
    // ------------------------------------------------------------------------

    timer;

    async handleClick(event) {
        event.stopPropagation();
        if (this.configuration.readOnly) return;
        if (event.detail === 1) {
            clearTimeout(this.timer);
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            this.timer = setTimeout(() => {
                const e = new CustomEvent('partclick', {
                    detail: {
                        id: this.index
                    }
                });
                this.dispatchEvent(e);
            }, 500);
        }
    }

    handleDoubleClick(event) {
        if (this.configuration.readOnly) return;
        clearTimeout(this.timer);
        const e = new CustomEvent('partdoubleclick', { 
            detail: {
                id: this.index
            }
        });
        this.dispatchEvent(e);
    }

    handleDragStart(event) {
        if (this.configuration.readOnly) return;
        event.dataTransfer.setData('text/plain', this.index);
        event.dataTransfer.dropEffect = 'move';
    }
}