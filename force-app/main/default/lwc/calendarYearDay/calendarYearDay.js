import { LightningElement, api } from 'lwc';

export default class CalendarYearDay extends LightningElement {
    @api
    day;

    get classA() {
        if(!this.day.highlight) return null;
        if(this.day.highlight.type.length===1) {
            if(this.day.highlight.type.includes('one')) return 'highlighted-0';
            if(this.day.highlight.type.includes('two')) return 'highlighted-1';
            if(this.day.highlight.type.includes('three')) return 'highlighted-2';
        } else if(this.day.highlight.type.length===2) {
            if(this.day.highlight.type.includes('one') && this.day.highlight.type.includes('two')) return 'highlighted-3';
            if(this.day.highlight.type.includes('one') && this.day.highlight.type.includes('three')) return 'highlighted-4';
            if(this.day.highlight.type.includes('two') && this.day.highlight.type.includes('three')) return 'highlighted-5';
        } else if(this.day.highlight.type.length===3) {
            return 'highlighted-6';
        }
        console.warn('Unexpected highlight type(s): ', this.day.highlight.type);
    }

    // ----------------------------------------------------------------------------------------------------------------

    handleClick(event) {
        const e = new CustomEvent('dayclick', {detail: this.day.id});
        this.dispatchEvent(e);
    }
}