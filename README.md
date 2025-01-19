# calendar: A LWC calendar with a look and feel similar to Salesforce's Calendar

## Intro

This LWC provides many of the features of [Salesforce's calendar](https://help.salesforce.com/s/articleView?id=sf.calendar_create_examples.htm&type=5). Javascript and HTML can be redacted to meet specific requirements. In several respects, it is already now more versatile than Salesforce's Calendar. Examples:

- can be inserted anywhere, e.g. in a sidebar of a record page, or in a Community page
- can render events (e.g. of a day) in any order, e.g. based on priority or an itinerary
- can render icons inside selective events (e.g. a status "done")
- provides multi-select and multi-drag-drop behaviour, e.g. to facilitate simultaneous updates of events

## Not yet supported, on the roadmap:

- Mobile devices
- Removal of specific week days from view (e.g. remove Saturday and Sunday)
- A second mini-calendar for independent date choices and quick navigation
- Explicit support of being inserted in the sidebar
- Event types that behave (e.g. read-only vs. read-write) differently from each other
- Day view
- Wrapper that allows the selection of an SObject as input like Salesforce's calendar
- Visual indicator for today's date
- [Tooltips](https://www.lightningdesignsystem.com/components/tooltips/)

## Known issues

- Inconsistent language output: Sometimes the language of texts depends on the current user (week day names), sometimes constants that are set in Javascript
- A good solution for the case where not all events fit into a day: In case the calendar is configured to have a given height of a day cell, from a certain point on events might appear cut or fall out of the view

## Project Structure

The force-app directory comprises the top level calendar component (LWC calendar) with its child components.

The force-demo-app demonstrates the use of the calendar. It exposes the calendar @api variables as settings that
the user can configure, and it populates the calendar with example data. (The eventCalendar.js-meta.xml is interesting to 
understand supported configurations.)

Comments welcome.
