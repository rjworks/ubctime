import React, {useCallback, useState} from 'react';
import {Pie, PieChart, Sector} from 'recharts';
import {DropdownButton, NavDropdown} from "react-bootstrap";

const data = [
    {name: '<50%', value: 1},
    {name: '50-54%', value: 1},
    {name: '55-59%', value: 0},
    {name: '60-63%', value: 1},
    {name: '64-67%', value: 4},
    {name: '68-71%', value: 1},
    {name: '72-75%', value: 0},
    {name: '76-79%', value: 1},
    {name: '80-84%', value: 0},
    {name: '85-89%', value: 1},
    {name: '90-100%', value: 7},
];

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value} = props;
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
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#EEEEEE">
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
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#EEEEEE">{`${value}`}</text>
            {/*<text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">*/}
            {/*    {`(Rate ${(percent * 100).toFixed(2)}%)`}*/}
            {/*</text>*/}
        </g>
    );
};


const years = ["2020W", "2019W"];
const GradeDistribution = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentYear, setCurrentYear] = useState(years[0])
    const onPieEnter = useCallback(
        (_, index) => {
            setActiveIndex(index);
        },
        [setActiveIndex]
    );

    return (
        <div className="grade-distribution-container">
            <div className="grade-distribution">
                <h1>Grades History</h1>
                <DropdownButton variant="primary" menuAlign="right" className="year-dropdown" title={currentYear}>
                    {years.map((el, i) =>
                        <NavDropdown.Item
                            key={i}
                            onClick={() => setCurrentYear(el)}>
                            {/*{el === currentCampus ? null : el}*/}
                            {el}
                        </NavDropdown.Item>
                    )}
                </DropdownButton>
            </div>
            <PieChart width={320} height={270}>
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
                    data={data}
                    cx={150}
                    cy={120}
                    innerRadius={60}
                    outerRadius={80}
                    fill="url(#colorUv)"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                />
            </PieChart>
        </div>
    );
};

export default GradeDistribution;
