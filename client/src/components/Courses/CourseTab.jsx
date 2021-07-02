import React, {useEffect, useRef, useState} from 'react';
import '@fortawesome/fontawesome-free/css/all.css'
import 'material-icons/iconfont/material-icons.css';
import './styles.css';
import {useDispatch, useSelector} from "react-redux";
import {addTempEvent, removeTempEvent} from "../../actions/tempEvents";
import ZLString from 'lz-string';
import {addPermEvent, removePermEvent} from "../../actions/permEvents";
import {Alert} from "react-bootstrap";

function CourseTab({UBCOCourses, UBCVCourses, UBCOSectionsInfo, UBCVSectionsInfo}) {

    const [filteredData, setFilteredData] = useState(null);
    const [groups, setGroups] = useState(null);
    const [showSections, setShowSections] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [viewingSectionInfo, setViewingSectionInfo] = useState(null);
    const [courses, setCourses] = useState(null);
    const [allSectionInfo, setAllSectionInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [scrolledToTop, setScrolledToTop] = useState(false);
    const inputFocusRef = useRef(null);
    const dispatch = useDispatch();
    const permEvents = useSelector(state => state.permEvents);
    const campus = useSelector(state => state.campus);

    useEffect(() => {
        setCourses(campus === "UBC Okanagan" ? UBCOCourses : UBCVCourses);
        setAllSectionInfo(campus === "UBC Okanagan" ? UBCOSectionsInfo : UBCVSectionsInfo);
    }, [campus])

    useEffect(() => {
        if(courses !== null && allSectionInfo !== null) {
            const g = [];
            courses.forEach((el, i) => {
                if(g[el.subject] === undefined) {
                    g[el.subject] = {
                        "courses": [{
                            "course": el.course,
                            "sections": el.sections
                        }]
                    };
                } else {
                    g[el.subject].courses.push({
                        "course": el.course,
                        "sections": el.sections
                    });
                }
            })
            setGroups(g);
        }
    }, [courses, allSectionInfo]);

    useEffect(() => {
        if(groups !== null)
            setLoading(false);
    }, [groups]);

    const scrollToTop = () => {
        let target = document.getElementById("top-course-list");
        target.parentNode.scrollTop = target.offsetTop - target.parentNode.offsetTop;
    }

    const handleFilter = (event) => {
        scrollToTop();
        const searchWord = event.target.value;

        let newData = [];
        Object.keys(groups).map(key =>
            newData[key] = groups[key].courses.filter(val => val.course.toLowerCase().includes(searchWord.toLowerCase()))
        )

        if(searchWord === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newData);
        }
    };

    const addNewEvent = (data) => {

        if(data === undefined || data === null)
            return false;
        const date = {
            "Mon": 25,
            "Tue": 26,
            "Wed": 27,
            "Thu": 28,
            "Fri": 29
        };
        const d = new Date();
        const stHours = data.startTime.split(":")[0];
        const stMinutes = data.startTime.split(":")[1];
        const etHours = data.endTime.split(":")[0];
        const etMinutes = data.endTime.split(":")[1];

        data.start = new Date(d.getFullYear(), 0, date[data.day], stHours, stMinutes);
        data.end = new Date(d.getFullYear(), 0, date[data.day], etHours, etMinutes);

        let newEvent = data;

        if(newEvent.status === "perm") {
            dispatch(removeTempEvent(newEvent.title));
            dispatch(addPermEvent(newEvent));
            const currentEvents = JSON.parse(ZLString.decompress(localStorage.getItem("events")));
            if(currentEvents.length === 0) {
                localStorage.setItem("events", ZLString.compress(JSON.stringify([newEvent])));
            } else {
                for(const ev of currentEvents) {
                    if(newEvent.status === "perm" && ev.title !== newEvent.title) {
                        localStorage.setItem("events", ZLString.compress(JSON.stringify([...currentEvents, newEvent])));
                    }
                }
            }
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000)
        } else {
            let found = false;
            if(permEvents !== null){
                permEvents.forEach(el => {
                    if(el.title === newEvent.title)
                        found = true;
                })
            }

            if(!found)
                dispatch(addTempEvent(newEvent));
        }
    }

    const addSection = (section, status) => {
        const uniqueSectionInfo = [...new Map(viewingSectionInfo.map(item =>
            [item["section"], item])).values()];

        const info = uniqueSectionInfo.filter(v => v.section === section);
        let startTimes = [], endTimes = [], days = [], buildings = [], rooms = [];
        info.forEach(el => {
            el.classTimes.forEach(ct => {
                ct.startTimes.forEach(c => {
                    if(c !== undefined || c !== "") {
                        startTimes.push(c);
                    }
                })
                ct.endTimes.forEach(c => {
                    if(c !== undefined || c !== "") {
                        endTimes.push(c);
                    }
                })
                ct.endTimes.forEach(c => {
                    if(c !== undefined || c !== "") {
                        startTimes.push(c);
                    }
                })
                ct.days.forEach(c => {
                    if(c !== undefined || c !== "") {
                        days.push(c);
                    }
                })
                ct.rooms.forEach(c => {
                    if(c !== undefined || c !== "") {
                        rooms.push(c);
                    }
                })
                ct.buildings.forEach(c => {
                    if(c !== undefined || c !== "") {
                        buildings.push(c);
                    }
                })
            })
        })
        let data = null;
        info.forEach(el => {
            startTimes.forEach(st => {
                endTimes.forEach(et => {
                    days.forEach(day => {
                        buildings.forEach(b => {
                            rooms.forEach(r => {
                                day.split(" ").forEach(d => {
                                    const stHours = st.split(":")[0];
                                    const stMinutes = st.split(":")[1];
                                    const etHours = et.split(":")[0];
                                    const etMinutes = et.split(":")[1];
                                    if(stHours + ":" + stMinutes !== etHours + ":" + etMinutes) {
                                        data = {
                                            id: el._id,
                                            title: el.course + " " + section,
                                            section,
                                            subject: el.subject,
                                            courseNumber: el.courseNumber,
                                            instructor: el.instructor,
                                            modeOfDelivery: el.modeOfDelivery,
                                            startTime: st,
                                            endTime: et,
                                            day: d,
                                            building: b !== "" ? b : "N/A",
                                            room: r !== "" ? r : "N/A",
                                            link: el.link,
                                            campus: el.campus,
                                            session: el.session,
                                            status
                                        };
                                        addNewEvent(data);
                                    }
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    const removeSection = (title, status) => {
        status === "perm" ? dispatch(removePermEvent(title)) : dispatch(removeTempEvent(title));
    }
    return (
        loading || groups['MATH'] === undefined ? <div>Loading...</div> :
            <div>
                <Alert
                    className="success-alert" show={showSuccess} variant="success">
                    ✔️ Successfully Added Course.
                </Alert>
                <div className="course-search-bar">
                    <form>
                        <input
                            autoFocus={true}
                            autoComplete="true"
                            type="text"
                            onChange={handleFilter}
                            placeholder="Try COSC 111"/>
                        <button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                            }}>
                            <i className="fa fa-search"/>
                        </button>
                    </form>
                </div>
                <div className="courses">
                    <div id="top-course-list" ref={inputFocusRef}/>
                    {
                        showSections ? filteredData !== null && filteredData['MATH'] !== undefined ? viewingSectionInfo === null ?
                            <div>Loading....</div> : Object.values(filteredData[currentCourse[0]]).map((el, i) => {
                                if(!scrolledToTop){
                                    scrollToTop();
                                    setScrolledToTop(true);
                                }
                                if(el.course === currentCourse[1]) {
                                    return <div key={i}>
                                        <button
                                            className="back-to-courses-button"
                                            onClick={() => {
                                                setScrolledToTop(false);
                                                setShowSections(false);
                                            }}
                                        >
                                            GO BACK
                                        </button>
                                        <div key={i} className="section-group">
                                            {el.course}
                                            {el.sections.map((sec, j) => {
                                                return <div
                                                    className="section-name"
                                                    key={j}
                                                    onMouseEnter={() => {
                                                        addSection(sec, "temp")
                                                    }}
                                                    onMouseLeave={() => {
                                                        removeSection(el.course + " " + sec, "temp");
                                                    }}
                                                    onClick={() => {
                                                        addSection(sec, "perm")
                                                    }}
                                                >
                                                    {el.course + " " + sec}
                                                    <span className="material-icons-outlined">add_circle_outline</span>
                                                </div>
                                            })}
                                        </div>
                                    </div>
                                }
                                return <div>UHmmm...</div>
                            }) :
                            // console.log(groups[currentCourse[0]].courses)
                            viewingSectionInfo === null ?
                                <div>Loading....</div> : Object.values(groups[currentCourse[0]].courses).map((el, i) => {
                                    if(!scrolledToTop){
                                        scrollToTop();
                                        setScrolledToTop(true);
                                    }
                                    if(el.course === currentCourse[1]) {
                                        return <div key={i}>
                                            <button
                                                className="back-to-courses-button"
                                                onClick={() => {
                                                    setScrolledToTop(false);
                                                    setShowSections(false);
                                                }}
                                            >
                                                GO BACK
                                            </button>
                                            <div key={i} className="section-group">
                                                {el.course}
                                                {el.sections.map((sec, j) => {
                                                    return <div
                                                        className="section-name"
                                                        key={j}
                                                        onMouseEnter={() => {
                                                            addSection(sec, "temp")
                                                        }}
                                                        onMouseLeave={() => {
                                                            removeSection(el.course + " " + sec, "temp");
                                                        }}
                                                        onClick={() => {
                                                            addSection(sec, "perm")
                                                        }}
                                                    >
                                                        {el.course + " " + sec}
                                                        <span className="material-icons-outlined">add_circle_outline</span>
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    }
                                    return <div>UHmmm...</div>
                                })
                            :
                            filteredData !== null && filteredData['MATH'] !== undefined ? Object.keys(filteredData).map((el, i) => {
                                    // scrollToTop();
                                    return <div key={i} className="course-group">
                                        {filteredData[el].length !== 0 && (el)}
                                        {filteredData[el].length !== 0 ? filteredData[el].map((g, j) => {
                                            return <div
                                                onClick={() => {
                                                    setCurrentCourse([el, g.course]);
                                                    setShowSections(true);
                                                    const secInfo = allSectionInfo.filter(val => val.course === g.course)
                                                    setViewingSectionInfo(secInfo)
                                                }}
                                                key={j}
                                                className={`course-name ${g.course}`}>
                                                {g.course}
                                                <span className="material-icons-outlined">navigate_next</span>
                                            </div>
                                        }):null}
                                    </div>
                                }) :
                                Object.keys(groups).map((el, i) => {
                                    return <div key={i} className="course-group">
                                        {el}
                                        {groups[el].courses.map((g, j) => {
                                            return <div
                                                onClick={() => {
                                                    setCurrentCourse([el, g.course]);
                                                    setShowSections(true);
                                                    const secInfo = allSectionInfo.filter(val => val.course === g.course)
                                                    setViewingSectionInfo(secInfo)
                                                }}
                                                key={j}
                                                className={`course-name ${g.course}`}>
                                                {g.course}
                                                <span className="material-icons-outlined">navigate_next</span>
                                            </div>
                                        })}
                                    </div>
                                })
                    }
                </div>
            </div>
    );
}

export default CourseTab;