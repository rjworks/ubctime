import React from 'react';
import './styles.css';
import 'material-design-icons/iconfont/material-icons.css';

function CourseTab(props) {
    return (
        <div className={"courses"}>
            <div className="bg-white shadow p-4 flex">
                <span className="w-auto flex justify-end items-center text-gray-500 p-2">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                     </svg>
                </span>
                <input className="w-full rounded p-2" type="text" placeholder="Try COSC 222"/>
                    <button className="bg-blue-700 hover:bg-blue-900 rounded text-white p-2 pl-4 pr-4">
                        <p className="font-semibold text-xs">Search</p>
                    </button>
            </div>
        </div>
);
}

export default CourseTab;