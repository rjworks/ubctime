import React, {useEffect, useState} from 'react';
import '../Calendar/CalendarUpload'
import '../../styles.css'
import WelcomePopup from "./WelcomePopup";
import Split from 'react-split';
import './styles.css';
import CourseTab from "../Courses/CourseTab";
import Navbarr from "./Navbarr";
import Calendar from "../Calendar/Calendar";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState(null);
    useEffect(() => {
        console.log(loading)
        const getcourses = async() => {
            setLoading(false);
            setCourses([
                {
                    "_id": "60d4d7449c8a4819142e491d",
                    "subject": "COSC",
                    "course": "COSC",
                    "title": "Anthropology",
                    "faculty": "Faculty of Arts and Sciences",
                    "session": "2021W",
                    "campus": "UBCO",
                    "__v": 0
                }])
        }
        if(courses === null)
            getcourses().catch((e) => {
                console.log(e.message)
            });
    })

    return (
        courses === null ?
            <div className="triple-spinner"/>
            :
            <div className="home">
                {/*<Navbar/>*/}
                <WelcomePopup/>
                <Navbarr/>
                <div className="nice-border">
                    <Split
                        className="split"
                        sizes={[75, 25]}
                        minSize={[350, 350]}
                        expandToMin={true}
                        gutterSize={5}
                        gutterAlign="center"
                        dragInterval={1}
                        direction="horizontal"
                        cursor="col-resize"
                        onDrag={() => {
                            console.log("Dragging")
                        }}
                    >
                        <Calendar/>
                        <CourseTab courses={courses}/>
                    </Split>
                </div>
            </div>
    );
};

export default Home;
