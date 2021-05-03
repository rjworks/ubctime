import React, {useState} from 'react';
import './styles.css';
import 'material-design-icons/iconfont/material-icons.css';
import {FixedSizeList as List} from "react-window";

function CourseTab(props) {

    const [courses, setCourses] = useState([
        {
            course: 'COSC 222',
            professor: 'Sensei',
            room: '123'
        },
        {
            course: 'COSC 211',
            professor: 'Sensei',
            room: '123'
        }
    ]);

    const courseList = ['COSC 111', 'COSC 121', 'COSC 222'];

    const [showCourseInfo, setShowCourseInfo] = useState(false);
    const Row = ({index, style}) => (
        <div className="flex justify-between m-4 shadow p-4 border-double border-blue-600
                 rounded-md bg-blue-800 text-white bg-gradient-to-r from-blue-800 to-blue-500">{courseList[index]}
            <div className="flex">
                <button
                    className="focus:outline-none transition duration-300 ease-in-out
                transform hover:-translate-y-1 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </button>
                <button
                    className="focus:outline-none transition duration-300 ease-in-out
                    transform hover:-translate-y-1 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                         viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 9l-7 7-7-7"/>
                    </svg>
                </button>
            </div>
        </div>
    );
    return (
        <div className={"courses"}>
            <div className="bg-white shadow-md p-4 flex rounded-md">
                <span className="w-auto flex justify-end items-center text-gray-500 p-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                     </svg>
                </span>
                <input
                    className="w-full rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent"
                    type="text"
                    placeholder="Try COSC 222"/>
                <button className="
                rounded bg-blue-800
                hover:bg-blue-700
                text-white p-2 pl-4 pr-4 transition duration-300">
                    <p className="font-semibold text-md">Search</p>
                </button>
                <ul>
                </ul>
            </div>
            <div className="text-lg font-semibold shadow-md p-4 py-4 px-4 rounded-md space-y-4">
                <List
                    height={300}
                    itemCount={courseList.length}
                    itemSize={35}
                    width={300}
                >
                    {Row}
                </List>
                {/*{courses.map((el, i) =>*/}
                {/*    <div*/}
                {/*        key={i}*/}
                {/*        className="flex justify-between shadow p-4 border-double border-blue-600
                 rounded-md bg-blue-800 text-white">*/}
                {/*        <div>*/}
                {/*            {el.course}*/}
                {/*            <p*/}
                {/*                className="text-lg bg-red-400 mt-2 font-semibold shadow-md rounded-md space-y-4">*/}
                {/*                p*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*    />*/}
                {/*<div className="flex">*/}
                {/*        <button className="focus:outline-none hover:text-blue-500 transition duration-300">*/}
                {/*            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"*/}
                {/*                 viewBox="0 0 24 24"*/}
                {/*                 stroke="currentColor">*/}
                {/*                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/}
                {/*                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>*/}
                {/*            </svg>*/}
                {/*        </button>*/}
                {/*        <button className="focus:outline-none hover:text-blue-500 transition duration-300">*/}
                {/*            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"*/}
                {/*                 viewBox="0 0 24 24"*/}
                {/*                 stroke="currentColor">*/}
                {/*                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}*/}
                {/*                      d="M19 9l-7 7-7-7"/>*/}
                {/*            </svg>*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*)}*/}
                {/*<div className="shadow p-4">{courses.map((el, i) => el.professor)}</div>*/}
            </div>
        </div>
);
}

export default CourseTab;