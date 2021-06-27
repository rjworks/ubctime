import React, {useRef, useState} from 'react';
import '@fortawesome/fontawesome-free/css/all.css'
import 'material-icons/iconfont/material-icons.css';
import './styles.css';

const groups = [];

function CourseTab(props) {
    const courses = props.courses;
    const [filteredData, setFilteredData] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const inputFocusRef = useRef(null);
    const options = [];
    const dataNoDuplicates = new Set();

    courses.forEach((course, i) => {
        if(course === undefined) return;
        dataNoDuplicates.add(course.course.split(" ")[0]);
    })

    dataNoDuplicates.forEach((el, i) => {
        if(el === undefined) return;
        options.push({
            name: el,
            type: 'group',
            items: []
        })
    })

    courses.forEach((course, i) => {
        if(course === undefined) return;
        const subj = course.course.split(" ")[0];
        options.forEach((option, j) => {
            if(options[j].name === subj && course.course !== null) {
                options[j].items.push({
                    "name": course.course
                })
            }
        })
    });

    const handleFilter = (event) => {
        let target = document.getElementById("top-course-list");
        target.parentNode.scrollTop = target.offsetTop - target.parentNode.offsetTop;

        const searchWord = event.target.value;
        let newFilter = options.map(function(el) {
            el.items = el.items.filter(function(x) {
                return x.name.includes(searchWord.toLowerCase());
            });
            return el;
        });

        if(searchWord === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter);
        }
    };

    return (
        !courses ? <div>Loading...</div> :
            <div>
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
                        filteredData.length > 0 ? filteredData.map((el, i) => {
                                return (
                                    <div key={i} className="course-group">
                                        {el.items.length > 0 && el.name}
                                        {el.items.map((course, i) => {
                                            return <div key={i} className="course-name">{course.name}</div>
                                        })}
                                    </div>
                                )
                            }) :
                            options.map((el, i) => {
                                return (
                                    <div key={i} className="course-group">
                                        {el.name}
                                        {el.items.map((course, i) => {
                                            return (
                                                <div
                                                    onClick={() => alert("heyy")}
                                                    key={i}
                                                    className="course-name">{course.name}</div>
                                            )
                                        })}
                                    </div>
                                )
                            })
                    }
                </div>
            </div>
    );
}

export default CourseTab;