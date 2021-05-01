import React, {useState} from 'react';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styled from "@emotion/styled";
import './styles.css';
import CalendarUpload from "./CalendarUpload";
// add styles as css
export const StyleWrapper = styled.div`
  .fc-event-title-container div{
    font-size: 13px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #002145;
}`
  
function Calendar(props) {

    const [events, setEvents] = useState([
        {
            start: '2014-11-10T10:00:00', end: '2014-11-10T16:00:00', title: 'COSC 222 Lecture',
            extendedProps: {
                department: 'BioChemistry',
                description: 'nothing',
                professor: 'Abdallah senpai',
            },
        },
        {start: '2014-11-12T08:00:00', end: '2014-11-12T13:00:00', title: 'COSC 211 Lecture',
            extendedProps: {
                department: 'Computer Science',
                description: 'You learn nothing here boi!',
                professor: 'Abdallah sensei',
            },}]);
    const [isHovering, setIsHovering] = useState(false);
    const [hoveredEvent, setHoveredEvent] = useState({});

    return (
        <div className={"calendar"}>
            <StyleWrapper>
                <FullCalendar
                    height={'auto'}

                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView={"timeGridWeek"}
                    headerToolbar={false}
                    eventDisplay={'block'}
                    initialDate={"2014-11-10"}
                    slotMinTime={"08:00:00"}
                    slotMaxTime={"22:00:00"}
                    displayEventTime={false}
                    eventColor={'#DFF0D8'}
                    eventTextColor={'#000000'}
                    allDaySlot={false}
                    firstDay={0}
                    dayHeaderFormat={{weekday: 'short'}}
                    weekends={true}
                    eventClick={(arg) => {
                        alert(arg.event.title)
                    }}
                    eventMouseEnter={(arg) => {
                        setHoveredEvent({
                            title: arg.event.title,
                            start: arg.event.start,
                            end: arg.event.end,
                            department: arg.event.extendedProps.department,
                            professor: arg.event.extendedProps.professor,
                            description: arg.event.extendedProps.description,
                        })
                        setIsHovering(true);
                    }}
                    eventMouseLeave={() => {
                        setIsHovering(false);
                        setHoveredEvent({});
                    }}
                    events={events}
                />
            </StyleWrapper>
            {hoveredEvent !== undefined && isHovering ?
                // console.log(hoveredEvent.title)
               <div>
                   <p> {hoveredEvent.title}</p>
                   <p>From {hoveredEvent.start.toString()} to {hoveredEvent.end.toString()}</p>
                   <p>Department: {hoveredEvent.department}</p>
                   <p>Professor: {hoveredEvent.professor}</p>
                   <p>Description: {hoveredEvent.description}</p>
               </div>
                : null}

                {/*<CalendarUpload/>*/}
        </div>
    );
}

export default Calendar;