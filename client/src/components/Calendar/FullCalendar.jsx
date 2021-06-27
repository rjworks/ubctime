// import React, {useState} from 'react';
// import FullCalendar from "@fullcalendar/react";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import styled from "@emotion/styled";
// import './styles.css';
// // add styles as css
// export const StyleWrapper = styled.div`
//   .fc-event-title-container div {
//     font-size: 13px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     height: 100%;
//     font-weight: 600;
//     color: #FFFFFF;
//     background: #3B82F6;
//     box-shadow: 200px 0 100px -100px #1D4ED8 inset, 0 0 0 black;
//     transition: background 2s ease, box-shadow 1s ease;
//   }
//
//   .fc-event-title-container div:hover {
//     background: #1D4ED8;
//     box-shadow: 200px 0 100px -100px #3B82F6 inset, 0 0 0 black;
//   }
//
//   .fc-col-header-cell-cushion {
//     color: #1E40AF;
//   }
//
//   .fc-timegrid-slot-label-cushion.fc-scrollgrid-shrink-cushion {
//     color: #1E40AF;
//     font-weight: 700;
//   }
// `
// let ran = false;
// function FullCalendar(props) {
//
//     const calendarRef = React.createRef();
//     const checkEventColor = (day) => {
//         const date = new Date(day);
//         // console.log(`${date.getDay()} is ${date.getDay()%2}`)
//       //  console.log(`day: ${date.getDay()}`)
//       //  console.log(date.toString())
//         if(date.getDay() % 2 == 0){
//             return '#3B82F6';
//         }else{
//             return '#1E40AF';
//         }
//     }
//
//     const [events, setEvents] = useState([
//         {
//             start: '2014-11-10T10:00:00', end: '2014-11-10T16:00:00', title: 'COSC 222 Lecture',
//             extendedProps: {
//                 department: 'BioChemistry',
//                 description: 'Idiot',
//                 professor: 'Abdallah senpai',
//             }
//         },
//         {
//             start: '2014-11-10T16:00:00', end: '2014-11-10T17:00:00', title: 'COSC 210 Lecture',
//             extendedProps: {
//                 department: 'BioChemistry',
//                 description: 'Idiot',
//                 professor: 'Abdallah Senpai',
//             }
//         },
//         {
//             start: '2014-11-11T12:00:00', end: '2014-11-10T13:30:00', title: 'COSC 304 Lab',
//             extendedProps: {
//                 department: 'BioChemistry',
//                 description: 'Idiot',
//                 professor: 'Abdallah senpai',
//             },
//         },
//         {
//             start: '2014-11-12T08:00:00', end: '2014-11-12T13:00:00', title: 'COSC 211 Lecture\n\n new line',
//             description: '\nIdiot',
//             extendedProps: {
//                 department: 'Computer Science',
//                 description: 'Idiot',
//                 professor: 'Abdallah sensei',
//             }
//         }]);
//     const [isHovering, setIsHovering] = useState(false);
//     const [eventColor, setEventColor] = useState({});
//     const [hoveredEvent, setHoveredEvent] = useState({});
//
//     // useEffect(() => {
//     //     if(!ran){
//     //         checkEventColor();
//     //         ran = true;
//     //     }
//     // }, []);
//
//
//     return (
//         <div className={"calendar"}>
//             <StyleWrapper>
//                 <FullCalendar
//                     height={'auto'}
//                     plugins={[timeGridPlugin, interactionPlugin]}
//                     ref={calendarRef}
//                     initialView={"timeGridWeek"}
//                     headerToolbar={false}
//                     eventDisplay={'block'}
//                     initialDate={"2014-11-10"}
//                     slotMinTime={"08:00:00"}
//                     slotMaxTime={"20:00:00"}
//                     displayEventTime={false}
//                     eventDidMount={function(info) {
//                         // info.el.title = info.el.title.concat("\n" + info.event.extendedProps.description);
//                         // console.log(info)
//                         // info.el.textContent += "\nSUp idiot"
//                     }}
//                     //#2563EB
//                     windowResizeDelay={1}
//                     // eventColor={'#1E40AF'}
//                     allDaySlot={false}
//                     firstDay={0}
//                     dayHeaderFormat={{weekday: 'short'}}
//                     weekends={true}
//                     windowResize={() => {
//                         let calendarApi = calendarRef.current.getApi()
//                         calendarApi.updateSize()
//                     }}
//                     // eventClick={(arg) => {
//                     //     alert(arg.event.title)
//                     // }}
//                     eventMouseEnter={(arg) => {
//                         setHoveredEvent({
//                             title: arg.event.title,
//                             start: arg.event.start,
//                             end: arg.event.end,
//                             department: arg.event.extendedProps.department,
//                             professor: arg.event.extendedProps.professor,
//                             description: arg.event.extendedProps.description,
//                         })
//                         setIsHovering(true);
//                     }}
//                     eventMouseLeave={() => {
//                         setIsHovering(false);
//                         setHoveredEvent({});
//                     }}
//                     events={events}
//                 />
//             </StyleWrapper>
//             {/*{hoveredEvent !== undefined && isHovering ?*/}
//             {/*    // console.log(hoveredEvent.title)*/}
//             {/*   <div>*/}
//             {/*       <p> {hoveredEvent.title}</p>*/}
//             {/*       <p>From {hoveredEvent.start.toString()} to {hoveredEvent.end.toString()}</p>*/}
//             {/*       <p>Department: {hoveredEvent.department}</p>*/}
//             {/*       <p>Professor: {hoveredEvent.professor}</p>*/}
//             {/*       <p>Description: {hoveredEvent.description}</p>*/}
//             {/*   </div>*/}
//             {/*    : null}*/}
//
//                 {/*<CalendarUpload/>*/}
//         </div>
//     );
//
// }
//
// export default FullCalendar;