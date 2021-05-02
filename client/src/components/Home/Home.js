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
import A from '../a'
import B from '../b'

const Home = () => {

    return (
        <div>
            {/*<Split*/}
            {/*    sizes={[75, 25]}*/}
            {/*    minSize={100}*/}
            {/*    expandToMin={false}*/}
            {/*    gutterSize={10}*/}
            {/*    gutterAlign="right"*/}
            {/*    snapOffset={30}*/}
            {/*    dragInterval={2}*/}
            {/*    direction="horizontal"*/}
            {/*    cursor="col-resize"*/}
            {/*>*/}
            {/*    <A />*/}
            {/*    <B />*/}
            {/*</Split>*/}
            <Navbar/>
            <WelcomePopup />
            <Split
                sizes={[25,75]}
                minSize={350, 350}
                expandToMin={true}
                gutterSize={5}
                gutterAlign="center"
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
