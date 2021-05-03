const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const fs = require('fs')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (e) => console.error(e));
db.once('open', () => console.log("Connected to Database"));

app.use(express.json());

const coursesRouter = require('./routes/courses');
app.use('/courses', coursesRouter);

app.listen(3000, () => console.log("Server started"));

const courseList = {};
// just the general information such as the course code and faculty
//get all the subjects from https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-all-departments
const scrapeSubjects = (sessionYear, sessionTerm, campus) => {
    const url = `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${sessionTerm}&campuscd=${campus}&campus=${campus}&pname=subjarea&tname=subj-all-departments&sessyr=${sessionYear}`;
    axios.get(url)
        .then(res => {
            const subjects = [];
            const $ = cheerio.load(res.data);
            $('.section1, .section2').each((i, el) => {
                const subjectCode = $(el).children().first().text();
                const subjectLink = `https://courses.students.ubc.ca${$(el).children().first().children('a').attr('href')}`;
                const subjectTitle = $(el).children().eq(1).text().trim();
                const subjectFaculty = $(el).children().last().text();
                subjects[i] = {subjectCode, subjectLink, subjectTitle, subjectFaculty};
            })
            // console.log(courses)
            // for(const course of courses) {
            //     console.log("Subject Code: " + course.courseCode)
            //     console.log("Subject Link: " + course.courseLink)
            //     console.log("Subject Title: " + course.courseTitle)
            //     console.log("Subject Faculty: " + course.courseFaculty + "\n")
            // }
            //return subjects object
            console.log("call scrapeSubjects")
            // scrapeCourses("COSC", suje);

            //  console.log(subjects)
            //     fs.writeFile('./subjects.json', JSON.stringify(subjects), 'utf-8', function(err) {
            //         if (err) throw err
            //         console.log('Done!')
                //})

            for(const subject of subjects){
                fs.readFile('./subjects.json', 'utf-8', function(err, data) {
                    if (err) throw err

                    var arrayOfObjects = JSON.parse(data)
                    console.log(subject)
                    arrayOfObjects.subjects.push(subject)

                    fs.writeFile('./subjects.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
                        if (err) throw err
                        console.log('Done!')
                    })
                })
            }

            // fs.readFile('./subjects.json', 'utf-8', function(err, data) {
            //     if (err) throw err
            //
            //     const arrayOfObjects = JSON.parse(data);
            //     for(const subject of arrayOfObjects){
            //         //console.log(subject.subjectCode)
            //        scrapeCourses(subject.subjectCode, subject.subjectTitle, subject.subjectFaculty, sessionYear, sessionTerm, campus);
            //     }
            //     // console.log(arrayOfObjects)
            // })
            // setTimeout(() => {
            //     for(const subject of subjects) {
            //         scrapeCourses(subject.subjectCode, subject.subjectTitle, subject.subjectFaculty, sessionYear, sessionTerm, campus);
            //     }
            // }, 60*1000)
            return subjects;
        })
}

// get the courses including the course number. This is an example of the page we're getting info from:
// https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-department&dept=INDG
const scrapeCourses = (subjectCode, subjectTitle, subjectFaculty, sessionYear, sessionTerm, campus) => {
    const url = `https://courses.students.ubc.ca/cs/courseschedule?tname=subj-department&sessyr=${sessionYear}&sesscd=${sessionTerm}&campuscd=${campus}&dept=${subjectCode}&pname=subjarea`;
    axios.get(url)
        .then(res => {
            const courses = [];
            const $ = cheerio.load(res.data);
            $('.section1, .section2').each((i, el) => {
                const course = $(el).children().first().text();
                // extract the numbers from course const
                const courseNumber = course.replace(/^\D+/g, '');
                const courseLink = `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${sessionTerm}&campuscd=${campus}&pname=subjarea&tname=subj-course&course=${courseNumber}&sessyr=${sessionYear}&dept=${subjectCode}`;
                const courseTitle = $(el).children().last().text()
                courses[i] = {course, courseNumber, courseLink, courseTitle};
            })
            // console.log(courses)
           // for(const c of courses){
            for(const course of courses){
                fs.readFile('./courses.json', 'utf-8', function(err, data) {
                    if (err) throw err

                    var arrayOfObjects = JSON.parse(data)
                    arrayOfObjects.courses.push(course)

                    fs.writeFile('./courses.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
                        if (err) throw err
                        console.log('Done!')
                    })
                })
            }


            // }
            //     for(const course of courses) {
            //         // console.log("Course Code: " + course.course)
            //         // console.log("Course Number: " + course.courseNumber)
            //         // console.log("Course Link: " + course.courseLink)
            //         // console.log("Course Title: " + course.courseTitle + "")
            //         // console.log("Course Faculty: " + subjectFaculty + "\n")
            //         scrapeCourseSections(course.course, course.courseNumber, course.courseTitle, subjectFaculty, sessionYear, sessionTerm, campus);
            //     }
            // setTimeout(() => {
            //     for(const course of courses) {
            //         // console.log("Course Code: " + course.course)
            //         // console.log("Course Number: " + course.courseNumber)
            //         // console.log("Course Link: " + course.courseLink)
            //         // console.log("Course Title: " + course.courseTitle + "")
            //         // console.log("Course Faculty: " + subjectFaculty + "\n")
            //         scrapeCourseSections(course.course, course.courseNumber, course.courseTitle, subjectFaculty, sessionYear, sessionTerm, campus);
            //     }
            // }, 60*1000);
            return courses;
        })
}

// actually get information from the course given the course number, code, session, and campus
const scrapeCourseSections = (courseCode, courseNumber, courseTitle, subjectFaculty, sessionYear, sessionTerm, campus) => {
    const url = `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${sessionTerm}&campuscd=${campus}&pname=subjarea&tname=subj-course&course=${courseNumber}&sessyr=${sessionYear}&dept=${courseCode}`;
    axios.get(url)
        .then(res => {
            const courses = [];
            const $ = cheerio.load(res.data);
            $('.section1, .section2').each((i, el) => {
                const courseActivity = $(el).children().eq(2).text();
                // if(activity.includes("Web-Oriented Course") || activity.includes("Lecture")) {
                const course = $(el).children().eq(1).children('a').text();
                const courseSection = course.substring(9, 12);
                const courseLink = `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${sessionTerm}&campuscd=${campus}&pname=subjarea&tname=subj-section&course=${courseNumber}&sessyr=2020&section=${courseSection}&dept=${courseCode}`
                $(el).children().eq(1).children('a').attr('href');
                if(course !== '')
                    courses[i] = {course, courseActivity, courseSection, courseTitle, subjectFaculty, courseLink};
            })
            console.log("scrapeCourseSections got called!")
            setTimeout(() => {
                for(const course of courses) {
                    console.log(course)
                }
            }, 60*1000)
            return courses;
        })
}

// scrapeCourseSections("COSC", 111, "Computer science", "BSC", 2020, "W", "UBCO");
scrapeSubjects(2020, "W", "UBCO")

// scapeSubjects(2021, "S", "UBC");
// scrapeCourses("COSC", 2021, "S", "UBCO")
// scrapeCourseLectures("MATH", 101, 2020, "W", "UBCO")
//
// axios.post('http://localhost:3000/courses',
//     {
//         "course": "NOOB",
//         "section": 101,
//         "professor": "Senapi",
//         "faculty": "Faculty of Anima LMAO",
//         "location": "Room 51",
//         "startDate": "May 2",
//         "endDate": "Not June 2"
//     })