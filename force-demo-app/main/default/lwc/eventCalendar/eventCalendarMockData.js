const getEvents = () => {
    return [
                {
                    Id: '1',
                    Subject: 'Empty Postbox',
                    StartDateTime: '2023-11-29T11:00:00.000Z',
                    EndDateTime: '2023-11-29T12:00:00.000Z'
                },
                {
                    Id: '2',
                    Subject: 'Replace Lightbulb',
                    StartDateTime: '2023-11-29T13:30:00.000Z',
                    EndDateTime: '2023-11-29T15:45:00.000Z'
                },
                {
                    Id: '3',
                    Subject: 'Clean Windows',
                    StartDateTime: '2023-11-30T08:00:00.000Z',
                    EndDateTime: '2023-11-30T09:00:00.000Z'
                },
                {
                    Id: '4',
                    Subject: 'Empty Garbage',
                    StartDateTime: '2023-11-30T14:00:00.000Z',
                    EndDateTime: '2023-11-30T16:00:00.000Z'
                },
                {
                    Id: '5',
                    Subject: 'Replenish Printer Paper',
                    StartDateTime: '2023-12-01T08:00:00.000Z',
                    EndDateTime: '2023-12-01T09:00:00.000Z'
                },
                {
                    Id: '6',
                    Subject: 'Hoover',
                    StartDateTime: '2023-12-01T09:00:00.000Z',
                    EndDateTime: '2023-12-01T11:00:00.000Z'
                },
                {
                    Id: '7',
                    Subject: 'Listen to Receptionist',
                    StartDateTime: '2023-12-01T11:00:00.000Z',
                    EndDateTime: '2023-12-01T14:00:00.000Z'
                },
                {
                    Id: '8',
                    Subject: 'Oil the Door Hinges',
                    StartDateTime: '2023-12-01T13:00:00.000Z',
                    EndDateTime: '2023-12-01T15:00:00.000Z'
                },
                {
                    Id: '9',
                    Subject: 'Sweep the Floor',
                    StartDateTime: '2023-12-01T15:00:00.000Z',
                    EndDateTime: '2023-12-01T16:00:00.000Z'
                },
                {
                    Id: '10',
                    Subject: 'Sulk',
                    StartDateTime: '2023-12-02T08:00:00.000Z',
                    EndDateTime: '2023-12-02T16:00:00.000Z'
                },
                {
                    Id: '11',
                    Subject: 'Enjoy a Fun Day',
                    StartDateTime: '2023-12-03T08:00:00.000Z',
                    EndDateTime: '2023-12-03T12:00:00.000Z'
                },
                {
                    Id: '12',
                    Subject: 'Meetings',
                    StartDateTime: '2023-12-03T12:00:00.000Z',
                    EndDateTime: '2023-12-03T16:00:00.000Z'
                },
                {
                    Id: '13',
                    Subject: 'Meetings',
                    StartDateTime: '2023-12-23T13:00:00.000Z',
                    EndDateTime: '2023-12-23T16:00:00.000Z'
                },
    ]};

const getPublicHolidays = () => {
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
        '2023-12-25',
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
    ]};

export { getEvents, getPublicHolidays };