import { createElement } from 'lwc';
import CalendarPart from 'c/calendarPart';

describe('c-calendar-part', () => {
    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('calendarPart: behaviour when month', () => {
        const element = createElement('c-calendar-part', {
            is: CalendarPart
        });

        populateElement(element, 'month');

        document.body.appendChild(element);

        const div = element.shadowRoot.querySelector('div');
        expect(div.className).toBe('stacked');
    });

    it('calendarPart: behaviour when week', () => {
        const element = createElement('c-calendar-part', {
            is: CalendarPart
        });

        populateElement(element, 'week');

        document.body.appendChild(element);

        const div = element.shadowRoot.querySelector('div');
        expect(div.className).toBe('positioned');
    });

    function populateElement(element, period = 'month') {
        element.index = '0';
        element.title = 'Meeting in Havanna';
        element.fromDateTime = new Date('2020-01-01T08:00:00.000Z');
        element.toDateTime = new Date('2020-01-01T09:00:00.000Z');
        element.configuration = {
            period: period,
            readOnly: false
        };
    }
});