const ical = require('cal-parser');
const fs = require("fs");

const myCalendarString = fs.readFileSync("D:\\arjay\\Documents\\Personal projects\\JavaScript\\ubctime\\ical.ics", "utf-8");

const parsed = ical.parseString(myCalendarString);

// Read Calendar Metadata
//console.log(parsed.calendarData);

// Read Events
const events = [];
// console.log(parsed.events[0].recurrenceRule.origOptions.byweekday)
parsed.events.forEach((e, index) => {
    const course = e.summary.value;
    const timeZoneId = e.dtstart.params.tzid;
    const dateStart = e.dtstart.value;
    const dateEnd = e.dtend.value;
    const location = e.location.value;
    const termEnd = e.recurrenceRule.options.until;
    events[index] = {course, location, timeZoneId, dateStart, dateEnd};
});

// const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
// const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// console.log(parsed.events)