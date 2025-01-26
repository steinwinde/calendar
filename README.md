# calendar: A LWC calendar with a look and feel similar to Salesforce's Calendar

## Intro

This LWC provides many of the features of [Salesforce's calendar](https://help.salesforce.com/s/articleView?id=sf.calendar_create_examples.htm&type=5). Javascript and HTML can be redacted to meet specific requirements. In several respects, it is already now more versatile than Salesforce's Calendar. Examples:

- can be inserted anywhere, e.g. in a sidebar of a record page, or in a Community page
- can render events (e.g. of a day) in any order, e.g. based on priority or an itinerary
- can render icons inside selective events (e.g. a status "done")
- provides multi-select and multi-drag-drop behaviour, e.g. to facilitate simultaneous updates of events
- can be configured to provide Salesforce's Scheduler calendar (see e.g. [here](https://help.salesforce.com/s/articleView?id=platform.ls_read_salesforce_calendar.htm&type=5))

## On the Roadmap

- Better rendering on mobile devices
- Configuration in order to display an hour or minutes scale for day view (like it already exists for week view)
- JSON configuration instead of list of attributes to enable conditional properties like "if mobile, show scheduler, else normal view"
- Removal of specific week days from view (e.g. remove Saturday and Sunday)
- Background events e.g. to indicate holidays that stretch across several days
- A second mini-calendar for independent date choices and quick navigation
- Explicit support of being inserted in the sidebar
- Event types that behave (e.g. read-only vs. read-write) differently from each other
- Wrapper that allows the selection of an SObject as input like Salesforce's calendar
- Visual indication for today's date
- [Tooltips](https://www.lightningdesignsystem.com/components/tooltips/)
- [Other Salesforce calendars](https://help.salesforce.com/s/articleView?id=service.pfs_view_calendar.htm&type=5) could be emulated

## Known Issues

- Inconsistent language output: Sometimes the language of texts depends on the current user (week day names), sometimes constants that are set in Javascript (make use of https://stackoverflow.com/questions/70542229/is-it-possible-to-translate-words-day-week-month-year-with-pure-js-in)
- A good solution for the case where not all events fit into a day: In case the calendar is configured to have a given height of a day cell, from a certain point on events might appear cut or fall out of the view

## Project Structure

The _force-app_ directory comprises the top level calendar component (LWC calendar) with its child components.

The _force-demo-app_ demonstrates the use of the (afore) calendar. It exposes the calendar @api variables as settings that
the user can configure, and it populates the calendar with example data based on a Javascript file. (In order to understand 
supported configurations, it's worth reading the eventCalendar.js-meta.xml .)

## Examples

Without modifications, the example _force-demo-app_ shows this screen.

The respective year view looks like this.

After ticking the box "Render as Scheduler" and "Stacking for order and size of week items" in the Lightning App builder, the week view looks like this.



Comments welcome.
