import React, {useEffect} from 'react';
import '../Calendar/CalendarUpload'
import '../../styles.css'
import WelcomePopup from "./WelcomePopup";
import CalendarUpload from "../Calendar/CalendarUpload";
import Calendar from "../Calendar/Calendar";
import Split from 'react-split'
import './styles.css';
import CourseTab from "../Courses/CourseTab";
import Navbar from "./Navbar";

const Home = () => {

    return (
        <div>
            <Navbar/>
            <WelcomePopup />
            <Split
                sizes={[25, 75]}
                minSize={100}
                expandToMin={false}
                gutterSize={10}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="horizontal"
                cursor="col-resize"
            >
                <CourseTab />
                <Calendar />
            </Split>
            {/*<CalendarUpload/>*/}
        </div>
    );
};

export default Home;
