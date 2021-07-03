import React, {useCallback, useEffect, useState} from 'react';
import {Pie, PieChart, Sector} from 'recharts';
import {Alert, Button, DropdownButton, NavDropdown} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {removePermEvent} from "../../actions/permEvents";
import axiosInstance from "../../client";

const renderActiveShape = (props) => {

    // const [data, setData] = useState(null);
    const RADIAN = Math.PI / 180;
    const {cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value} = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text style={{zIndex: 100022, color: "red", position:"fixed"}} x={cx} y={cy} dy={8} textAnchor="middle" fill="#EEEEEE">
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                style={{zIndex: 100022, color: "red", position:"fixed"}}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
                style={{zIndex: 100022, color: "red", position:"fixed"}}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" style={{zIndex: 1000, backgroundColor: "red"}}/>
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#EEEEEE"
                  style={{zIndex: 100022, color: "red", position:"fixed"}}>{`${value}`}</text>
            {/*<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">*/}
            {/*    {`(Rate ${(percent * 100).toFixed(2)}%)`}*/}
            {/*</text>*/}
        </g>
    );
};


const years = ["2020W", "2020S", "2019W", "2019S", "2018W", "2018S", "2017W", "2017S", "2016W", "2016S", "2015W", "2015S", "2014W", "2014S",];
const GradeDistribution = (props) => {
    const {campus, subject, courseNumber} = props.courseInfo;
    const [gradesData, setGradesData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentYear, setCurrentYear] = useState(years[0])
    const [loading, setLoading] = useState(true);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailed, setShowFailed] = useState(false);
    const [alreadyDeleted, setAlreadyDeleted] = useState(false);

    const dispatch = useDispatch();
    const onPieEnter = useCallback(
        (_, index) => {
            setActiveIndex(index);
        },
        [setActiveIndex]
    );

    useEffect(() => {
        const grabGrades = async() => {
            const res = await axiosInstance.get(`/${campus}/grades/${currentYear}/${subject}/${courseNumber}/overall`);
            const d = res.data[0];
            setGradesData([
                {name: '<50%', value: parseInt(d.grades["<50"])},
                {name: '50-54%', value: parseInt(d.grades["50-54"])},
                {name: '55-59%', value: parseInt(d.grades["55-59"])},
                {name: '60-63%', value: parseInt(d.grades["60-63"])},
                {name: '64-67%', value: parseInt(d.grades["64-67"])},
                {name: '68-71%', value: parseInt(d.grades["68-71"])},
                {name: '72-75%', value: parseInt(d.grades["72-75"])},
                {name: '76-79%', value: parseInt(d.grades["76-79"])},
                {name: '80-84%', value: parseInt(d.grades["80-84"])},
                {name: '85-89%', value: parseInt(d.grades["85-89"])},
                {name: '90-100%', value: parseInt(d.grades["90-100"])}
            ]);
        }
        grabGrades().then(r => {
        })
            .catch(e => {
                setGradesData(null);
            })
    }, [campus, subject, courseNumber, currentYear])

    // useEffect(() => {
    //     grabGrades().then(r => {
    //     })
    //         .catch(e => {
    //             setGradesData(null);
    //         })
    // }, [currentYear])

    useEffect(() => {
        console.log('no longer loading')
        console.log(gradesData)
        setLoading(false);
    }, [gradesData]);

    useEffect(() => {
        return () => {
            setGradesData([]);
            setLoading(true);
        }
    }, [])

    return (
        <div className="grade-distribution-container">
            <div className="grade-distribution">
                <span>Grades History (overall)</span>
                <div className="grade-distribution-button-container">
                    <DropdownButton variant="primary" menuAlign="right" className="year-dropdown"
                                    title={currentYear}>
                        {years.map((el, i) =>
                                <NavDropdown.Item
                                    key={i}
                                    onClick={() => setCurrentYear(el)}>
                                    {/*{el === currentCampus ? null : el}*/}
                                    {el}
                                </NavDropdown.Item>
                            )}
                        </DropdownButton>
                        <Button variant="danger"
                                className="delete-course-button"
                                onClick={() => {
                                    if(!alreadyDeleted) {
                                        dispatch(removePermEvent(props.courseInfo.title))
                                        setAlreadyDeleted(true);
                                        setShowSuccess(true);
                                        setTimeout(() => {
                                            setShowSuccess(false);
                                        }, 3000)
                                    } else {
                                        setShowFailed(true);
                                        setTimeout(() => {
                                            setShowFailed(false);
                                        }, 3000)
                                    }
                                }}
                        >
                            Delete
                        </Button>
                        <Alert
                            className="success-alert" show={showSuccess} variant="success">
                            ✔️ Successfully Removed Course
                        </Alert>
                        <Alert
                            className="success-alert" show={showFailed} variant="danger">
                            ❌ Already Removed Course
                        </Alert>
                    </div>
                </div>
            {loading ? <div>Loading...</div> : gradesData === null ? <div
                    style={{color: "white", fontSize: "2rem", padding: "2rem"}}
                    className="grade-distribution-container grade-distribution">No grade history data found for this
                    course/session<br/><br/><br/></div> :
                <div className="grades-history-chart">
                    <PieChart width={350} height={270}>
                        <defs>
                            <linearGradient
                                id="colorUv"
                                x1="0"
                                y1="0"
                                    x2="0"
                                    y2="100%"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop offset="0" stopColor="rgb(29, 78, 216)"/>
                                    <stop offset="0.5" stopColor="rgb(58, 127, 243)"/>
                                    <stop offset="1" stopColor="rgb(88, 147, 245)"/>
                                </linearGradient>
                            </defs>
                            <Pie
                                activeIndex={activeIndex}
                                activeShape={renderActiveShape}
                                data={gradesData}
                                cx={160}
                                cy={120}
                                innerRadius={60}
                                outerRadius={80}
                                fill="url(#colorUv)"
                                dataKey="value"
                                onMouseEnter={onPieEnter}
                            />
                            {/*<Tooltip wrapperStyle={{zIndex: 1}} />*/}
                        </PieChart>
                    </div>
                }
            </div>

    );
};

export default GradeDistribution;
