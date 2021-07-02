import React, {useEffect, useState} from 'react';
import './styles.css';
import {Calendar as BigCalendar, momentLocalizer} from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
import MyModal from "../Modal/MyModal";
import GradeDistribution from "../Charts/GradeDistribution";
import {useSelector} from "react-redux";

const localizer = momentLocalizer(moment)

let courseInfo = null;

const Calendar = () => {

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const permEvents = useSelector(state => {
        return state.permEvents;
    });

    const tempEvents = useSelector(state => {
        return state.tempEvents;
    });

    const showCourseInfo = () => {
        if(courseInfo !== null) {
            return <MyModal
                show={show}
                courseInfo={courseInfo}
                body={[
                    <GradeDistribution courseInfo={courseInfo}/>
                ]}
                type="courseInfo"
                button="Close"
                handleClose={handleClose}/>
        }
    }

    useEffect(() => {
        if(tempEvents !== null && permEvents !== null){
            setEvents([...tempEvents, ...permEvents]);
        }else {
            setEvents([]);
        }
    }, [tempEvents, permEvents])
    useEffect(() => {
        setLoading(false);
    }, [events])

    return (

        loading ? <div>Loading...</div> :
            <div className='calendar'>
                {show && (showCourseInfo())}
                <BigCalendar
                    date={new Date('Sun, 26 Jan 2021 17:33:00 UTC +00:00')}
                    min={new Date(2021, 1, 24, 8)}
                    max={new Date(2021, 1, 30, 20)}
                    localizer={localizer}
                    events={events}
                    formats={{dayFormat: 'ddd'}}
                    startAccessor="start"
                    endAccessor="end"
                    onNavigate={() => console.log("navigating...")}
                    titleAccessor={'title'}
                    step={30}
                    style={{height: '92.5vh'}}
                    onSelectEvent={(e) => {
                        if(!show) {
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
                    defaultView='work_week'
                    views={['work_week']}
                />
            </div>
    );
};

export default Calendar;
