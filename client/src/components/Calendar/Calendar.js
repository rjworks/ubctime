import React, {useState} from 'react';
import './styles.css';
import {Calendar as BigCalendar, momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
import MyModal from "../Modal/MyModal";
import GradeDistribution from "../Charts/GradeDistribution";

const localizer = momentLocalizer(moment)
const date = new Date();
// console.log(localizer)
const events = [
    {
        id: 1,
        title: 'COSC 111 101 Lecture',
        professor: 'Abdallah Senpai',
        room: 'EME 69',
        start: new Date(2021, 6 - 1, 27, 17, 30, 0),
        end: new Date(2021, 6 - 1, 27, 19, 0, 0),
    }];

// let showedCourseInfo = false;
let courseInfo = null;

const Calendar = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const showCourseInfo = () => {
        if(courseInfo !== null) {
            return <MyModal
                show={show}
                courseInfo={courseInfo}
                body={[
                    <GradeDistribution/>
                ]}
                type="courseInfo"
                button="Close"
                handleClose={handleClose}/>
        }
    }
    return (
        <div className='calendar'>
            {show && showCourseInfo()}
            <BigCalendar
                localizer={localizer}
                events={events}
                formats={{dayFormat: 'ddd'}}
                startAccessor="start"
                endAccessor="end"
                titleAccessor={'title'}
                step={30}
                style={{height: '92.5vh'}}
                onSelectEvent={(e)=>{
                    if(!show){
                        // showed = true;
                        handleShow();
                        courseInfo = e;
                    }
                }}
                eventPropGetter={
                    (event, start, end, isSelected) => {
                        let newStyle = {
                            background: "#3B82F6",
                            boxShadow: "200px 0 100px -100px #1D4ED8 inset, 0 0 0 black",
                            transition: "background 2s ease, box-shadow 1s ease",
                            color: 'white',
                            display: "block"
                        };

                        return {
                            className: "",
                            style: newStyle
                        };
                    }
                }
                toolbar={false}
                defaultView='week'
                views={['week']}
                min={new Date(date.getFullYear(), date.getMonth(), date.getDay(), 8)}
                max={new Date(date.getFullYear(), date.getMonth(), date.getDay(), 20)}
            />
        </div>
    );
};

export default Calendar;
