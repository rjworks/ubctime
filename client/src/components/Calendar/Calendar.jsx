import React, {useState, useEffect} from 'react';
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import styled from "@emotion/styled";
import './styles.css';
// add styles as css
export const StyleWrapper = styled.div`
  .fc-event-title-container div {
    font-size: 13px;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-weight: 600;
    color: #FFFFFF;
  }

  .fc-col-header-cell-cushion {
    color: #1E40AF;
  }

  .fc-timegrid-slot-label-cushion.fc-scrollgrid-shrink-cushion {
    color: #1E40AF;
    font-weight: 700;
  }
`
let ran = false;
function Calendar(props) {

    const calendarRef = React.createRef();
    const checkEventColor = (day) => {
        const date = new Date(day);
        // console.log(`${date.getDay()} is ${date.getDay()%2}`)
      //  console.log(`day: ${date.getDay()}`)
      //  console.log(date.toString())
        if(date.getDay() % 2 == 0){
            return '#3B82F6';
        }else{
            return '#1E40AF';
        }
    }

    const [events, setEvents] = useState([
        {
            start: '2014-11-10T10:00:00', end: '2014-11-10T16:00:00', title: 'COSC 222 Lecture',
            extendedProps: {
                department: 'BioChemistry',
                description: 'nothing',
                professor: 'Abdallah senpai',
            },
            color: checkEventColor('2014-11-10T10:00:00')
        },
        {
            start: '2014-11-10T16:00:00', end: '2014-11-10T17:00:00', title: 'COSC 210 Lecture',
            extendedProps: {
                department: 'BioChemistry',
                description: 'nothing',
                professor: 'Abdallah senpai',
            },
            color: checkEventColor('2014-11-10T10:00:00')
        },
        {
            start: '2014-11-11T12:00:00', end: '2014-11-10T13:30:00', title: 'COSC 304 LAB',
            extendedProps: {
                department: 'BioChemistry',
                description: 'nothing',
                professor: 'Abdallah senpai',
            },
            color: checkEventColor('2014-11-10T10:00:00')
        },
        {
            start: '2014-11-12T08:00:00', end: '2014-11-12T13:00:00', title: 'COSC 211 Lecture',
            extendedProps: {
                department: 'Computer Science',
                description: 'You learn nothing here boi!',
                professor: 'Abdallah sensei',
            },
            color: checkEventColor('2014-11-10T10:00:00')
        }]);
    const [isHovering, setIsHovering] = useState(false);
    const [eventColor, setEventColor] = useState({});
    const [hoveredEvent, setHoveredEvent] = useState({});

    // useEffect(() => {
    //     if(!ran){
    //         checkEventColor();
    //         ran = true;
    //     }
    // }, []);


    return (
        <div className={"calendar"}>
            <StyleWrapper>
                <FullCalendar
                    height={'auto'}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    ref={calendarRef}
                    initialView={"timeGridWeek"}
                    headerToolbar={false}
                    eventDisplay={'block'}
                    initialDate={"2014-11-10"}
                    slotMinTime={"06:00:00"}
                    slotMaxTime={"23:00:00"}
                    displayEventTime={false}
                    //#2563EB
                    windowResizeDelay={1}
                    // eventColor={'#1E40AF'}
                    eventBorderColor={'#000000'}
                    allDaySlot={false}
                    firstDay={0}
                    dayHeaderFormat={{weekday: 'short'}}
                    weekends={true}
                    windowResize={() => {
                        console.log(calendarRef)
                        let calendarApi = calendarRef.current.getApi()
                        calendarApi.updateSize()
                    }}
                    // eventClick={(arg) => {
                    //     alert(arg.event.title)
                    // }}
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
            {/*{hoveredEvent !== undefined && isHovering ?*/}
            {/*    // console.log(hoveredEvent.title)*/}
            {/*   <div>*/}
            {/*       <p> {hoveredEvent.title}</p>*/}
            {/*       <p>From {hoveredEvent.start.toString()} to {hoveredEvent.end.toString()}</p>*/}
            {/*       <p>Department: {hoveredEvent.department}</p>*/}
            {/*       <p>Professor: {hoveredEvent.professor}</p>*/}
            {/*       <p>Description: {hoveredEvent.description}</p>*/}
            {/*   </div>*/}
            {/*    : null}*/}

                {/*<CalendarUpload/>*/}
        </div>
    );

}

export default Calendar;