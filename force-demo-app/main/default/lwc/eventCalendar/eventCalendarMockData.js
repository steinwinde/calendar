const getEvents = () => {
    const d = new Date();
    const one = d.toISOString().substring(0, 10);
    d.setDate(d.getDate() + 1);
    const two = d.toISOString().substring(0, 10);
    d.setDate(d.getDate() + 1);
    const three = d.toISOString().substring(0, 10);
    d.setDate(d.getDate() + 1);
    const four = d.toISOString().substring(0, 10);
    d.setDate(d.getDate() + 1);
    const five = d.toISOString().substring(0, 10);
    d.setDate(d.getDate() + 6);
    const six = d.toISOString().substring(0, 10);
    return [
        {
            Id: '1',
            Subject: 'Empty Postbox',
            StartDateTime: one + 'T11:00:00.000Z',
            EndDateTime: one + 'T12:00:00.000Z'
        },
        {
            Id: '2',
            Subject: 'Replace Lightbulb',
            StartDateTime: one + 'T13:30:00.000Z',
            EndDateTime: one + 'T15:45:00.000Z'
        },
        {
            Id: '3',
            Subject: 'Clean Windows',
            StartDateTime: two + 'T08:00:00.000Z',
            EndDateTime: two + 'T15:00:00.000Z'
        },
        {
            Id: '4',
            Subject: 'Watch Paint Dry',
            StartDateTime: two + 'T14:00:00.000Z',
            EndDateTime: two + 'T16:00:00.000Z'
        },
        {
            Id: '5',
            Subject: 'Replenish Printer Paper and Toner',
            StartDateTime: three + 'T08:00:00.000Z',
            EndDateTime: three + 'T09:00:00.000Z'
        },
        {
            Id: '6',
            Subject: 'Hoover',
            StartDateTime: three + 'T09:00:00.000Z',
            EndDateTime: three + 'T11:00:00.000Z'
        },
        {
            Id: '7',
            Subject: 'Listen to Receptionist',
            StartDateTime: three + 'T11:00:00.000Z',
            EndDateTime: three + 'T14:00:00.000Z'
        },
        {
            Id: '8',
            Subject: 'Oil the Door Hinges',
            StartDateTime: three + 'T13:00:00.000Z',
            EndDateTime: three + 'T15:00:00.000Z'
        },
        {
            Id: '9',
            Subject: 'Sweep the Floor',
            StartDateTime: three + 'T15:00:00.000Z',
            EndDateTime: three + 'T16:00:00.000Z'
        },
        {
            Id: '10',
            Subject: 'Sulk',
            StartDateTime: four + 'T08:00:00.000Z',
            EndDateTime: four + 'T16:00:00.000Z'
        },
        {
            Id: '11',
            Subject: 'Enjoy a Fun Morning',
            StartDateTime: five + 'T08:00:00.000Z',
            EndDateTime: five + 'T12:00:00.000Z'
        },
        {
            Id: '12',
            Subject: 'Meet with the Boss',
            StartDateTime: five + 'T12:00:00.000Z',
            EndDateTime: five + 'T16:00:00.000Z'
        },
        {
            Id: '13',
            Subject: 'Meet with the Boss Again',
            StartDateTime: six + 'T08:00:00.000Z',
            EndDateTime: six + 'T09:00:00.000Z'
        },
        {
            Id: '14',
            Subject: 'Write a Report',
            StartDateTime: six + 'T09:00:00.000Z',
            EndDateTime: six + 'T10:00:00.000Z'
        },
        {
            Id: '15',
            Subject: 'Meet the Team, Take Notes, Make a Plan, Calculate the Cost, and then...',
            StartDateTime: six + 'T10:00:00.000Z',
            EndDateTime: six + 'T11:00:00.000Z'
        },
        {
            Id: '16',
            Subject: '... Double Check the Plan, and then...',
            StartDateTime: six + 'T11:00:00.000Z',
            EndDateTime: six + 'T12:00:00.000Z'
        },
        {
            Id: '17',
            Subject: '... fool around until late lunch.',
            StartDateTime: six + 'T13:00:00.000Z',
            EndDateTime: six + 'T14:00:00.000Z'
        },
        {
            Id: '18',
            Subject: 'Lunch with the Team',
            StartDateTime: six + 'T14:00:00.000Z',
            EndDateTime: six + 'T15:00:00.000Z'
        },
        {
            Id: '19',
            Subject: 'Twiddling my Thumbs',
            StartDateTime: six + 'T15:00:00.000Z',
            EndDateTime: six + 'T15:30:00.000Z'
        }
    ]};

const getPublicHolidays = ({year}) => {
    if(year === 2023) {
        return [
            '2023-01-01',
            '2023-04-10',
            '2023-05-01',
            '2023-05-08',
            '2023-05-18',
            '2023-05-29',
            '2023-07-14',
            '2023-08-15',
            '2023-11-01',
            '2023-11-11',
            '2023-12-25'
        ];
    } else if(year === 2024) {
        return [
            '2024-01-01',
            '2024-04-01',
            '2024-05-01',
            '2024-05-08',
            '2024-05-09',
            '2024-05-20',
            '2024-07-14',
            '2024-08-15',
            '2024-11-01',
            '2024-11-11',
            '2024-12-25'
        ]
    };
    return [];
}

export { getEvents, getPublicHolidays };