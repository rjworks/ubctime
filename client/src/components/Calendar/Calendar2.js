import React from 'react'
import FullCalendar from '@fullcalendar/react'
import {Component} from "react/cjs/react.production.min";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'

export default class Calendar2 extends Component {
    constructor() {
        super();
        this.state = {
            events: [
                {start: '2014-11-10T10:00:00', end: '2014-11-10T16:00:00', title: 'COSC 222 Lecture, Room 234'},
                {start: '2014-11-12T08:00:00', end: '2014-11-12T13:00:00', title: 'COSC 222 Lecture, Room 234'},
                //{start: '2014-13-10T08:00:00', end: '2014-13-10T13:00:00', title: 'COSC 222 Lecture, Room 234'}
            ],
            isHovering: false
        }
    }
    render() {
        // start: '2014-11-10T10:00:00',
        //     end: '2014-11-12=T16:00:00',
        return (
            <div>
                <FullCalendar
                    height={'auto'}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView={"timeGridWeek"}
                    initialDate={"2014-11-10"}
                    slotMinTime={"08:00:00"}
                    slotMaxTime={"22:00:00"}
                    displayEventTime={false}
                    eventColor={'#DFF0D8'}
                    eventBorderColor={'#b0bfaa'}
                    eventTextColor={'#000000'}
                    allDaySlot={false}
                    firstDay={0}
                    dayHeaderFormat={{weekday: 'short'}}
                    weekends={true}
                    eventClick={(arg) => {
                        alert(arg.event.title)
                    }}
                    eventMouseEnter={(arg) => {
                        console.log(arg.event)
                        this.setState({isHovering: true});
                    }}
                    eventMouseLeave={() => {
                       // console.log("leave")
                        this.setState({isHovering: false});
                    }}
                    events={this.state.events}
                />
            </div>
        )

    }
}