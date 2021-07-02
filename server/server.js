const axios = require('axios');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('axios-rate-limit');
const cors = require('cors')
const csv = require("csv-parse");
const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config();
const app = express();

(async() => {
    console.log("connecting")
    await mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
})();
console.log("done connecting")
const db = mongoose.connection;
db.on('error', (e) => console.error(e));
db.once('open', () => console.log("Connected to Database"));


app.use(express.json());
app.use(cors())
const router = require('./routes/router');
app.use('/api', router);
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is now running on port ${port}!`));

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const removeWhiteSpaces = (str, replacement = '') => {
    return str.replace(/  +/g, replacement)
}

const http = rateLimit(axios.create(), {maxRequests: 1, perMilliseconds: 10000, maxRPS: 1})

// just the general information such as the course code and faculty
//https://courses.students.ubc.ca/cs/courseschedule?sesscd=W&tname=subj-all-departments&sessyr=2020&campuscd=UBCO&pname=subjarea
//get all the subjects from https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-all-departments
//https://courses.students.ubc.ca/cs/courseschedule?tname=subj-department&sessyr=2020&sesscd=W&campuscd=UBCO&dept=ANTH&pname=subjarea
let requestsMadeUBC = 0;
let requestsMadeMongoAtlas = 0;
let totalRequestsLoop = 0;
const maxRequests = 6;
let scrapingErrors = [];
const scrapeSubjects = (sessionYear, sessionTerm, campus) => {
    campus = campus === "UBCV" ? "UBC" : "UBCO";
    const url = `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${sessionTerm}&campuscd=${campus}&campus=${campus}&pname=subjarea&tname=subj-all-departments&sessyr=${sessionYear}`;
    http.get(url)
        .then(res => {
            const subjects = [];
            const $ = cheerio.load(res.data);
            $('.section1, .section2').each((i, el) => {
                const subject = removeWhiteSpaces($(el).children().first().text());
                const title = removeWhiteSpaces($(el).children().eq(1).text());
                const faculty = removeWhiteSpaces($(el).children().last().text());
                subjects[i] = {subject, title, faculty};
            })
            campus = campus === "UBC" ? "UBCV" : "UBCO";
            for(const subject of subjects) {
                if(!subject.subject.includes("*")) {
                    http.post(`http://localhost:8000/api/${campus.toUpperCase()}/subjects`, {
                        "subject": subject.subject.replace(/  +/g, ' '),
                        "title": subject.title.replace(/  +/g, ' '),
                        "faculty": subject.faculty.replace(/  +/g, ' '),
                        "session": sessionYear + sessionTerm,
                        "campus": campus
                    }).then((r) => {
                        const random = Math.floor(Math.random() * 2);
                        if(random === 1) {
                            console.log('\x1b[36m%s\x1b[0m', "Post Successful!");  //cyan
                        } else {
                        }
                        console.log('\x1b[33m%s\x1b[0m', "Post Successful!");  //yellow

                    }).catch((r) => {
                        console.log(r)
                    })
                }
            }
            return subjects;
        })
}

const wait = ms => new Promise(res => setTimeout(res, ms))

const getSections = async(link) => {
    let ok = false;
    while(!ok) {
        try {
            console.log("called GET SECTIONS");
            const res = await http.get(link);
            const $ = cheerio.load(res.data);
            const sections = [];
            let prerequisites = 'N/A';
            $('.section1, .section2, body > div.container > div.content.expand')
                .each(async(j, el1) => {
                    // await wait(10000)
                    const name = $(el1).children().children('a').text();
                    // console.log($(el1).children('p').eq(2).text())
                    if(removeWhiteSpaces($(el1).children('p').eq(2).text(), " ") !== '')
                        prerequisites = removeWhiteSpaces($(el1).children('p').eq(2).text(), " ")
                    const subj = name.split(" ")[0];
                    if(name !== '' && name !== undefined && name.length <= 13) {
                        const section = name.split(" ")[2];
                        // console.log("name: " + name)
                        if(section !== undefined && section !== '' && section !== subj) {
                            // console.log("section: " + section)
                            console.log(`name: ${name} | section: ${section} | link: ${link}`)
                            sections.push(section);
                        }
                    }
                })
            ok = true;
            return [sections, prerequisites];
        } catch(e) {
            ok = false;
            scrapingErrors.push("getSections error: " + e.message);
        }
    }
}

// getSections('https://courses.students.ubc.ca/cs/courseschedule?sesscd=W&campuscd=UBCO&pname=subjarea&tname=subj-course&course=121&sessyr=2021&dept=COSC')
//     .then(r => {
//         console.log(r[1])
//     })
const getCoursesWithSections = async(courses) => {
    for(const c of courses) {
        // if(requestsMadeUBC >= maxRequests) {
        //     console.log("PAUSE GETTING SECTIONS")
        //     await wait(60 * 1000);
        //     requestsMadeUBC = 0;
        //     console.log("CONTINUE GETTING SECTIONS")
        // }
        requestsMadeUBC++;
        console.log("requestsMadeUBC: " + requestsMadeUBC)
        console.log("errors: " + scrapingErrors)
        const sec =await getSections(c.link);
        c.sections = sec[0];
        c.prerequisites = sec[1];
    }

    console.log(courses)
    return courses;
}
// get the courses including the course number. This is an example of the page we're getting info from:
// https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-department&dept=INDG
const scrapeCourses = async(subjects) => {
    let courses = [];
    let idx = 0;
    for(const subject of subjects) {
        let ok = false;
        while(!ok) {
            try {
                //2020W
                // console.log("WAITING 300 SECONDS BEFORE ANOTHER REQUEST FOR SCRAPING COURSES")
                // await wait(300 * 1000)
                const sessionYear = subject.session.substring(0, 4);
                const sessionTerm = subject.session.substring(4, 5);
                const url = `https://courses.students.ubc.ca/cs/courseschedule?tname=subj-department&sessyr=${sessionYear}&sesscd=${sessionTerm}&campuscd=${subject.campus === "UBCV" ? "UBC" : "UBCO"}&dept=${subject.subject}&pname=subjarea`;
                // if(requestsMadeUBC >= 10) {
                //     console.log("PAUSE SCRAPING COURSES")
                //     await wait(60 * 1000);
                //     requestsMadeUBC = 0;
                //     totalRequestsLoop++;
                //     console.log("CONTINUE SCRAPING COURSES")
                // }
                if(totalRequestsLoop !== 0 && totalRequestsLoop % 10 === 0) {
                    console.log("WAIT FOR TOTAL REQUESTS LOOP EVERY 10 LOOPS")
                    await wait(300 * 1000)
                }
                const res = await http.get(url);
                requestsMadeUBC++;
                console.log("requestsMadeUBC: " + requestsMadeUBC)
                console.log("errors: " + scrapingErrors)
                // console.log(url);
                const $ = cheerio.load(res.data);
                $('.section1, .section2').each(async(i, el) => {
                    const course = $(el).children().first().text();
                    //COSC 121
                    const courseNumber = course.split(" ")[1];
                    const link = `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${sessionTerm}&campuscd=${subject.campus === "UBCV" ? "UBC" : "UBCO"}&pname=subjarea&tname=subj-course&course=${courseNumber}&sessyr=${sessionYear}&dept=${subject.subject}`;
                    // console.log(sections)
                    const title = $(el).children().last().text();
                    console.log(idx)
                    courses[idx] = {
                        course,
                        "subject": subject.subject,
                        courseNumber,
                        title,
                        "prerequisites": 'N/A',
                        "faculty": subject.faculty,
                        "sections": [],
                        link,
                        "session": subject.session,
                        "campus": subject.campus
                    };
                    // console.log(courses)
                    idx++;
                })
                ok = true;
            } catch(e) {
                ok = false;
                scrapingErrors.push("scrape courses error: " + e.message);
            }
        }
    }
    return courses;
}

// scrapeCourses([
//     {
//         "_id": "60d4d74e9c8a4819142e4927",
//         "subject": "COSC",
//         "title": "Computer Science",
//         "faculty": "Faculty of Arts and Sciences",
//         "session": "2021W",
//         "campus": "UBCO",
//         "__v": 0
//     }
// ])

const grabCourses = async(campus) => {
    let ok = false;
    while(!ok){
        try {
            const res = await http.get(`http://localhost:8000/api/${campus}/subjects`);
            console.log("got res")
            const coursesNoSections = await scrapeCourses(res.data);
            console.log("got coursesNoSections")
            const coursesWithSections = await getCoursesWithSections(coursesNoSections);
            console.log("got coursesWithSections")
            console.log(coursesNoSections)
            console.log(coursesWithSections)
            for(const course of coursesWithSections) {
                if(requestsMadeMongoAtlas >= 50) {
                    console.log("PAUSE POSTING COURSE")
                    await wait(60 * 1000);
                    requestsMadeMongoAtlas = 0;
                    console.log("CONTINUE POSTING COURSE")
                }
                requestsMadeMongoAtlas++;
                console.log("requestsMadeMongoAtlas: " + requestsMadeMongoAtlas)
                await http.post(`http://localhost:8000/api/${campus}/courses`, {
                    "subject": course.subject,
                    "course": course.course,
                    "courseNumber": course.courseNumber,
                    "title": course.title,
                    "prerequisites": course.prerequisites,
                    "faculty": course.faculty,
                    "sections": course.sections,
                    "link": course.link,
                    "session": course.session,
                    "campus": course.campus,
                })
                console.log("POSTING DONE for course " + course.course)
            }
            ok = true;
        } catch(e) {
            ok = false;
            scrapingErrors.push("grabCourses error: " + e.message);
        }
    }
}

//get the actual section info with instructor, term date, startTime, endTime etc
const scrapeCourseSectionsInfo = async(sections) => {
    let idx = 0;
    console.log('eee');
    console.log(sections.length)
    const courseSectionsInfo = [];
    for(const course of sections) {
        for(const section of course.sections) {
            try {
                //           https://courses.students.ubc.ca/cs/courseschedule?sesscd=W&campuscd=UBCO&pname=subjarea&tname=subj-section&sessyr=2020&course=121&section=101&dept=COSC
                const url = `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${course.session.charAt(4)}&campuscd=${course.campus === "UBCV" ? "UBC" : "UBCO"}&pname=subjarea&tname=subj-section&sessyr=${course.session.slice(0, 4)}&course=${course.courseNumber}&section=${section}&dept=${course.subject}`;
                // const url = 'https://courses.students.ubc.ca/cs/courseschedule?sesscd=W&campuscd=UBCO&pname=subjarea&tname=subj-section&sessyr=2021&course=301&section=101&dept=COSC';
                const res = await http.get(url);
                // console.log(res.data)
                // const dat = 'hi'
                if(res.data !== undefined) {
                    const $ = cheerio.load(res.data);
                    $('body > div.container > div.content.expand')
                        .each((i, el) => {
                            const description = $(el).children('p').eq(0).text();
                            const activity = $(el).children('h4').eq(0).text();
                            const fullText = removeWhiteSpaces($(el).text(), ' ');
                            let credits = fullText.indexOf("Credits:");
                            credits = fullText.substring(credits, credits + 12).split(" ")[1];
                            // console.log(credits)
                            if(credits.toLowerCase() !== 'n/a'){
                                credits = credits.charAt(0);
                            }else{
                                credits = credits.toUpperCase();
                            }
                            // console.log(credits)
                            let modeOfDelivery = fullText.indexOf("Mode of Delivery:");
                            modeOfDelivery = fullText.substring(modeOfDelivery, modeOfDelivery + 28).split(" ")[3];
                            if(modeOfDelivery.toLowerCase().includes("in-person")){
                                modeOfDelivery = "In-Person";
                            }else{
                                modeOfDelivery = "Online";
                            }
                            let requiresInPersonAttendance = fullText.indexOf("Requires In-Person Attendance:");
                            requiresInPersonAttendance = fullText.substring(requiresInPersonAttendance, requiresInPersonAttendance + 34).split(" ")[3];

                            const t = cheerio.load('<table id="complex">' + $(el).children('table').eq(1).html() + '</table>');

                            cheerioTableparser(t);
                            let schedule = t('#complex').parsetable(true, true, true);

                            const s = cheerio.load('<table id="instructor">' + $(el).children('table').eq(2).html() + '</table>');
                            cheerioTableparser(s);
                            let instructor = s('#instructor').parsetable(true, true, true);
                            instructor = instructor[1][0];
                            // console.log(schedule)
                            const term = schedule[0][1];
                            let classTimes = {
                                'days': [],
                                'startTimes': [],
                                'endTimes': [],
                                'buildings': [],
                                'rooms': [],
                            };
                            classTimes.days = schedule[1].slice(1);
                            classTimes.startTimes =schedule[2].slice(1);
                            classTimes.endTimes = schedule[3].slice(1);
                            classTimes.buildings = schedule[4].slice(1);
                            classTimes.rooms = schedule[5].slice(1);

                            courseSectionsInfo[idx] = {
                                "activity": activity === undefined ? "N/A" : activity,
                                "course": course.course,
                                "courseNumber": course.courseNumber,
                                "subject": course.subject,
                                "section": section === undefined ? "N/A" : section,
                                "title": course.title,
                                "description": description,
                                "instructor": instructor === undefined ? "N/A" : instructor,
                                "modeOfDelivery": modeOfDelivery,
                                "requiresInPersonAttendance": requiresInPersonAttendance === undefined ? "N/A" : requiresInPersonAttendance,
                                "term": term,
                                "credits": credits === undefined ? "N/A" : credits,
                                "prerequisites": course.prerequisites,
                                "classTimes": classTimes,
                                "faculty": course.faculty,
                                "link": url,
                                "session": course.session,
                                "campus": course.campus
                            };
                            console.log(courseSectionsInfo[idx]);
                            idx++;
                        })
                }
            } catch(e) {
                console.log(e.message)
            }
        }
    }
    return courseSectionsInfo;
}

const getSectionsInfo = async(sections) => {
    scrapeCourseSectionsInfo(sections).then(async(r) => {
        try{
            for(const section of r){
                // console.log(section.activity)
                // console.log(section.credits)
                await http.post(`http://localhost:8000/api/${section.campus.toLowerCase()}/sections-info`, {
                    "activity": section.activity,
                    "course": section.course,
                    "courseNumber": section.courseNumber,
                    "subject": section.subject,
                    "section": section.section,
                    "title": section.title,
                    "description": section.description,
                    "instructor": section.instructor,
                    "modeOfDelivery": section.modeOfDelivery,
                    "requiresInPersonAttendance": section.requiresInPersonAttendance,
                    "term": section.term,
                    "credits": section.credits,
                    "prerequisites": section.prerequisites,
                    "classTimes": section.classTimes,
                    "faculty": section.faculty,
                    "link": section.link,
                    "session": section.session,
                    "campus": section.campus,
                })
                console.log("Successfully posted " + section.activity + " to /sections-info")
            }
        }catch(e){
            console.log(e.message)
        }
}).catch((r) => {
    console.log(r)
})
}
// getSectionsInfo([
//     {
//         "sections": [
//             "101",
//             "L01",
//             "L02",
//             "L03",
//             "L04",
//             "L05",
//             "L06",
//             "WL1"
//         ],
//         "_id": "60dbb8dc967dd5cf7e078c47",
//         "course": "COSC 101",
//         "subject": "COSC",
//         "courseNumber": "101",
//         "title": "Digital Citizenship",
//         "prerequisites": "N/A",
//         "faculty": "Faculty of Arts and Sciences",
//         "link": "https://courses.students.ubc.ca/cs/courseschedule?sesscd=W&campuscd=UBCO&pname=subjarea&tname=subj-course&course=101&sessyr=2021&dept=COSC",
//         "session": "2021W",
//         "campus": "UBCO",
//         "__v": 0
//     }
// ]);
// (async() => {
//     const courses = await http.get('http://localhost:8000/api/ubco/courses');
//     console.log(courses.data)
//     getSectionsInfo(courses.data).then(r => {
//         console.log("success getSectionsInfo")
//     }).catch(r => {
//         console.log("failed getSectionsInfo")
//     });
// })();
// grabCourses("UBCV")
//     .then((r) => {
//         console.log(r)
//         console.log("right here")
//     }).catch((e) => {
//     console.log(e.message)
//     console.log("error here")
// })
// scrapeSubjects("2021", "W", "UBCO")
// grabCourses("UBCO")
// grabSections()

const results = [];
fs.createReadStream('./grades/UBCO/2020W/UBCO-2020W-COSC.csv')
    .pipe(csv())
    .on('data', (data) => {
        results.push({
            campus: data[0],
            year: data[1],
            session: data[2],
            subject: data[3],
            courseNumber: data[4],
            detail: data[5],
            section: data[6],
            title: data[7],
            teachingTeam: data[8],
            enrolled: data[9],
            avg: data[10],
            stdDev: data[11],
            high: data[12],
            low: data[13],
            grades: {
                "<50": data[14],
                "50-54": data[15],
                "55-59": data[16],
                "60-63": data[17],
                "64-67": data[18],
                "68-71": data[19],
                "72-75": data[20],
                "76-79": data[21],
                "80-84": data[22],
                "85-89": data[23],
                "90-100": data[24]
            }
        })
    })
    .on('end', () => {
        // console.log(results)
        // console.log(results[0]);
        // console.log(results[1]);
        // [
        //   { NAME: 'Daffy Duck', AGE: '24' },
        //   { NAME: 'Bugs Bunny', AGE: '22' }
        // ]
    });
