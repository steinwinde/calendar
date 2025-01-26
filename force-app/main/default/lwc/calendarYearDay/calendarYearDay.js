import { LightningElement, api } from 'lwc';

export default class CalendarYearDay extends LightningElement {

    // day e.g. {"label":"4","id":"2025-4-4"}
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

    handleDayClick(event) {
        const e = new CustomEvent('dayclick', {detail: new Date(this.day.id)});
        this.dispatchEvent(e);
    }

    handlePartClick(event) {
        const e = new CustomEvent('partclick', {detail: new Date(this.day.id)});
        this.dispatchEvent(e);
    }
}