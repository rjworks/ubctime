import React, {useEffect, useState} from 'react';
import '../Calendar/CalendarUpload'
import '../../styles.css'
import WelcomePopup from "./WelcomePopup";
import Split from 'react-split';
import './styles.css';
import CourseTab from "../Courses/CourseTab";
import Navbar from "./Navbar";
import Calendar from "../Calendar/Calendar";
import LoadingScreen from "../Utils/LoadingScreen";
import LZString from 'lz-string';
import {useDispatch, useSelector} from "react-redux";
import {setPermEvents} from "../../actions/permEvents";
import {setCampus} from "../../actions/campus";
import {setSession} from "../../actions/session";
import axiosInstance from "../../client";

const Home = () => {
    const [UBCOCourses, setUBCOCourses] = useState(null);
    const [UBCOSectionsInfo, setUBCOSectionsInfo] = useState(null);
    const [UBCVCourses, setUBCVCourses] = useState(null);
    const [UBCVSectionsInfo, setUBCVSectionsInfo] = useState(null);
    const [savedEvents, setSavedEvents] = useState(null);
    const [hasData, setHasData] = useState(UBCOCourses !== null && UBCVCourses !== null && UBCOSectionsInfo !== null && UBCVSectionsInfo !== null);
    const dispatch = useDispatch();
    const permEvents = useSelector(state => state.permEvents);

    useEffect(() => {
        const checkNewData = async() => {
            try {
                const res = await axiosInstance.get('/newData');
                if(res.data.newData === true) {
                    localStorage.clear();
                    setHasData(false);
                }
            } catch(e) {
                console.log(e.message);
            }
        }
        const getCourses = async() => {
            await checkNewData();
            try {
                if(localStorage.getItem("UBCOCourses") === null
                    && localStorage.getItem("UBCVCourses") === null
                    && localStorage.getItem("events") === null
                    && localStorage.getItem("campus") === null) {

                    let res = await axiosInstance.get(`/ubco/courses`)
                    setUBCOCourses(res.data);
                    localStorage.setItem("UBCOCourses", LZString.compress(JSON.stringify(res.data)));

                    res = await axiosInstance.get(`/ubcv/courses`)
                    setUBCVCourses(res.data);
                    localStorage.setItem("UBCVCourses", LZString.compress(JSON.stringify(res.data)));

                    setSavedEvents([]);
                    localStorage.setItem("events", LZString.compress(JSON.stringify([])));

                    localStorage.setItem("campus", LZString.compress(JSON.stringify("UBC Okanagan")));
                    localStorage.setItem("session", LZString.compress(JSON.stringify("2021 Winter")));
                } else {
                    setUBCOCourses(JSON.parse(LZString.decompress(localStorage.getItem("UBCOCourses"))));
                    setUBCVCourses(JSON.parse(LZString.decompress(localStorage.getItem("UBCVCourses"))));
                    setSavedEvents(JSON.parse(LZString.decompress(localStorage.getItem("events"))));
                    dispatch(setSession((JSON.parse(LZString.decompress(localStorage.getItem("session"))))));
                    dispatch(setCampus((JSON.parse(LZString.decompress(localStorage.getItem("campus"))))));
                }
            } catch(e) {
                console.log(e.message);
            }
        }

        if(!hasData)
            getCourses().then(r => {
                setHasData(true);
            }).catch((e) => {
                console.log(e.message)
            });
    }, [dispatch, hasData])

    // after getting the courses, let's now get the sections info!
    useEffect(() => {
        if(UBCOCourses !== null && UBCVCourses !== null){
            const temp = Object.assign([], savedEvents);
            temp.forEach(el => {
                el.start = new Date(el.start);
                el.end = new Date(el.end);
            })
            dispatch(setPermEvents(temp));
            setHasData(true);
            if(localStorage.getItem("UBCOSectionsInfo") !== null && localStorage.getItem("UBCVSectionsInfo") !== null){
                setUBCOSectionsInfo(JSON.parse(LZString.decompress(localStorage.getItem("UBCOSectionsInfo"))));
                setUBCVSectionsInfo(JSON.parse(LZString.decompress(localStorage.getItem("UBCVSectionsInfo"))));
            }else{
                const getSectionsInfo = async() => {
                    let res = await axiosInstance.get(`/ubco/sections-info`)
                    setUBCOSectionsInfo(res.data);
                    localStorage.setItem("UBCOSectionsInfo", LZString.compress(JSON.stringify(res.data)));

                    res = await axiosInstance.get(`/ubcv/sections-info`)
                    setUBCVSectionsInfo(res.data);
                    localStorage.setItem("UBCVSectionsInfo", LZString.compress(JSON.stringify(res.data)));
                }

                // if(UBCOSectionsInfo === null && UBCVSectionsInfo === null){
                    console.log("get sections info")
                    getSectionsInfo().then(r => console.log("Got sections info")).catch(e => console.log("Didn't get sections info"))
                // }
            }
        }
    }, [UBCOCourses, UBCVCourses, dispatch, savedEvents])

    // useEffect(() => {
    //     const getSectionsInfo = async() => {
    //         let res = await axiosInstance.get(`/ubco/sections-info`)
    //         setUBCOSectionsInfo(res.data);
    //         localStorage.setItem("UBCOSectionsInfo", LZString.compress(JSON.stringify(res.data)));
    //
    //         res = await axiosInstance.get(`/ubcv/sections-info`)
    //         setUBCVSectionsInfo(res.data);
    //         localStorage.setItem("UBCVSectionsInfo", LZString.compress(JSON.stringify(res.data)));
    //     }
    //
    //     if(UBCOSectionsInfo === null && UBCVSectionsInfo === null){
    //         console.log("get sections info")
    //         getSectionsInfo().then(r => console.log("Got sections info")).catch(e => console.log("Didn't get sections info"))
    //     }
    // }, [UBCOSectionsInfo, UBCVSectionsInfo])
    // update events in local storage
    useEffect(() => {
        if(hasData){
            if(permEvents.length !== 0){
                localStorage.setItem("events", LZString.compress(JSON.stringify(permEvents)));
            }else if(permEvents.length === 0){
                localStorage.setItem("events", LZString.compress(JSON.stringify([])));
            }
        }
    }, [permEvents, dispatch, hasData])

    return (
        !hasData
            ?
            <LoadingScreen/>
            :
            <div className="home">
                <WelcomePopup/>
                <Navbar/>
                <div className="nice-border">
                    <Split
                        className="split"
                        sizes={[80, 20]}
                        minSize={[500, 220]}
                        expandToMin={false}
                        gutterSize={5}
                        gutterAlign="center"
                        dragInterval={1}
                        direction="horizontal"
                        cursor="col-resize"
                        onDrag={() => {
                            console.log("Dragging")
                        }}
                    >
                        <Calendar savedEvents={savedEvents}/>
                        <CourseTab
                            UBCOCourses={UBCOCourses}
                            UBCOSectionsInfo={UBCOSectionsInfo}
                            UBCVCourses={UBCVCourses}
                            UBCVSectionsInfo={UBCVSectionsInfo}
                        />
                    </Split>
                </div>
            </div>
    );
};

export default Home;
