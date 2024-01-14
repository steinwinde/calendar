import { api } from 'lwc';
import LightningModal from 'lightning/modal';


export default class EventCalendarChangeDateModal extends LightningModal {

    // can be empty, when creating a new part
    @api index;

    @api d;

    handleChangeDate(event) {
        this.d = event.detail.value;
    }

    handleOkay() {
        this.close(this.d);
    }
}