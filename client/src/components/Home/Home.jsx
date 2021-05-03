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
import ReactScrollableList from "react-scrollable-list";
import { FixedSizeList as List } from 'react-window';

const Home = () => {
    const courseList = ['COSC 111', 'COSC 121', 'COSC 222'];
    const Row = ({ index, style }) => (
        <div style={style}>{courseList[index]}</div>
    );
    return (
        <div>
            {/*<List*/}
            {/*    height={150}*/}
            {/*    itemCount={courseList.length}*/}
            {/*    itemSize={35}*/}
            {/*    width={300}*/}
            {/*>*/}
            {/*    {Row}*/}
            {/*</List>*/}
            <Navbar/>
            <WelcomePopup />
            <Split
                className="split"
                sizes={[75,25]}
                minSize={[350, 350]}
                expandToMin={true}
                gutterSize={5}
                gutterAlign="center"
                dragInterval={1}
                direction="horizontal"
                cursor="col-resize"
                onDrag={() => {
                    console.log("Dragging")}}
            >
                <Calendar />
                <CourseTab />
            </Split>
        </div>
    );
};

export default Home;
