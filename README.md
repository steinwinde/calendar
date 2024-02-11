# calendar
## A LWC calendar, with a look similar to Salesforce's Event Calendar

The force-app directory comprises the top level calendar component (LWC calendar) with its child components.

The force-demo-app demonstrates the use of the calendar. It exposes the calendar @api variables as settings that
the user can configure, and it populates the calendar with example data. (The eventCalendar.js-meta.xml is interesting to 
understand supported configurations.)

This calendar makes it possible to provide features not supported by Salesforce's Calendar. Examples:

- Insert the calendar whereever required, e.g. in a sidebar of a record page, in a Community page
- Render events (e.g. of a day) in a specific order not depending on times, e.g. based on an itinerary (number property of the SObject) or calculated on the fly
- Add icons to events indicating an important attribute, e.g. a status "done"
- Provide multi-select and multi-drag-drop behaviour, e.g. to facilitate updates of events of a single day at the same time limiting selection to events of single days

Not yet supported, on the roadmap:

- Mobile devices
- Removal of specific week days from view (e.g. remove Saturday and Sunday)
- A second mini-calendar for independent date choices and quick navigation
- Support of being inserted in the sidebar
- Event types that behave (e.g. read-only vs. read-write) differently from each other
- Day view
- Year view
- Wrapper that allows the selection of an SObject as input like Salesforce's calendar
- Indicator for today's date

Known issues:

- Inconsistent language output: Sometimes the language of texts depends on the current user (week day names), sometimes on Javascript constants
- Solution for the case where not all events fit into a day: Currently they are cut or don't appear at all, if they don't fit in the day.

Comments welcome.