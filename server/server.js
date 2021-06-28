const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('axios-rate-limit');
require('dotenv').config();
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

const router = require('./routes/router');
app.use('/api', router);
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is now running on port ${port}!`));

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const removeWhiteSpaces = (str) => {
    return str.replace(/  +/g, '')
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
            $('.section1, .section2, body > div.container > div.content.expand')
                .each(async(j, el1) => {
                    // await wait(10000)
                    const name = $(el1).children().children('a').text();
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
            return sections;
        } catch(e) {
            ok = false;
            scrapingErrors.push("getSections error: " + e.message);
        }
    }
}

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
        // console.log("WAIT 300 SECONDS BEFORE CALLING GETSECTIONS")
        // await wait(300 * 1000);
        // console.log("CONTINUE")
        // console.log(el.link)
        c.sections = await getSections(c.link);
        // console.log("with sections above")
    }

    console.log(courses)
    // courses.map(async(el, i) => {
    //     console.log("PAUSE")
    //     // console.log(sections)
    //     await wait(5000);
    //     console.log("CONTINUE")
    //     const sec = await getSections(el.link);
    //     // console.log(el.link)
    //     el.sections = sec;
    //     // console.log("with sections above")
    //     return courses;
    // })
    return courses;
    /**
     *     try{
        await wait(10000);
        console.log("called");
        const res = await http.get(link);
        const $ = cheerio.load(res.data);
        const sections = [];
        $('.section1, .section2, body > div.container > div.content.expand')
            .each((j, el1) => {
                const name = $(el1).children().children('a').text().trim();
                const section = name.split(" ")[2];
                if(name !== '' && name !== undefined) {
                    sections.push(section);
                }
            })
        return sections;
    }catch(e){
        console.log("error at getSections: " + e.message)
    }
     */
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
    // then((r) => {
    //     // same options as constructor
    //     scrapeCourses(r.data).then((data) => {
    //         const courses = await getCoursesWithSections()
    // data.map(async(course, i) => {
    //     if(course !== undefined) {
    //         http.post(`http://localhost:8000/api/${campus}/courses`, {
    //             "subject": course.subject,
    //             "course": course.course,
    //             "courseNumber": course.courseNumber,
    //             "title": course.title,
    //             "faculty": course.faculty,
    //             "sections": course.sections,
    //             "link": course.link,
    //             "session": course.session,
    //             "campus": course.campus,
    //         }).then(r => {
    //             const random = Math.floor(Math.random() * 2);
    //             if(random === 1) {
    //                 console.log('\x1b[36m%s\x1b[0m', "Post successful to " + campus + " courses");  //cyan
    //             } else {
    //             }
    //             console.log('\x1b[33m%s\x1b[0m', "Post successful to " + campus + " courses");  //yellow
    //
    //         })
    //             .catch((e) => {
    //                 console.log(e.message)
    //             })
    //     }
    // })
    //     });
    // });
}
//
// grabCourses("UBCO")
//     .then((r) => {
//         console.log(r)
//         console.log("right here")
//     }).catch((e) => {
//     console.log(e.message)
//     console.log("error here")
// })


grabCourses("UBCV");
// actually get information from the course given the course number, code, session, and campus
const scrapeCourseSections = async(courses) => {
    let idx = 0;
    const course_sections = [];
    for(const course of courses) {
        const url = `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${course.sessionTerm}&campuscd=${course.campus}&pname=subjarea&tname=subj-course&course=${course.courseNumber}&sessyr=${course.sessionYear}&dept=${course.courseCode}`;
        const res = await http.get(url);
        if(res.data !== undefined) {
            const $ = cheerio.load(res.data);
            $('.section1, .section2, body > div.container > div.content.expand')
                .each((i, el) => {

                    const name = $(el).children().children('a').text().trim();
                    // if(name === '') return;
                    const section = name.substring(name.length - 3, name.length);
                    const activity = $(el).children().eq(2).text().trim();
                    const link = `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${course.sessionTerm}&campuscd=${course.campus}&pname=subjarea&tname=subj-section&course=${course.courseNumber}&sessyr=${course.sessionYear}&section=${section}&dept=${course.courseCode}`
                    console.log(name)
                    console.log(link)
                    const rawAll = $(el).children().text().replace(/  +/g, ' ');
                    //  console.log(rawAll)
                    let credits = 0;
                    let prerequisites = 0;
                    let startCredits = rawAll.indexOf("Credits:");
                    let prerequisitesCredits = rawAll.indexOf("Pre-reqs:");
                    if(startCredits !== -1) {
                        credits = rawAll.substring(rawAll.indexOf("Credits:") + 13, rawAll.indexOf("Credits:") + 15);
                    }
                    if(prerequisitesCredits !== -1) {
                        prerequisites = rawAll.substring(rawAll.indexOf("Pre-reqs:") + 13, rawAll.indexOf("Pre-reqs:") + 15);
                    }
                    // console.log("Name: "+name)
                    // console.log("Credits: "+credits)
                    // console.log("Pre: "+prerequisites)
                    if(name !== '') {
                        course_sections[idx] = {
                            "name": removeWhiteSpaces(name),
                            "activity": removeWhiteSpaces(activity),
                            "credits": credits === '' || null ? 0 : parseInt(credits),
                            "prerequisites": prerequisites === '' || null ? "None" : prerequisites,
                            "faculty": course.courseFaculty.trim(),
                            "link": link.trim(),
                            "session": course.session,
                            "campus": course.campus,
                        };
                    }
                    idx++;
                    //  console.log(idx + "/" + courses.length);
                })
        }
    }
    return course_sections;
}

//get the actual section info with instructor, term date, startTime, endTime etc
const scrapeCourseSectionsInfo = async(sections) => {
    let idx = 0;
    console.log('eee');
    console.log(sections.length)
    const courseSectionsInfo = [];
    for(const section of sections) {
        // const url = `https://courses.students.ubc.ca/cs/courseschedule?sesscd=${course.sessionTerm}&campuscd=${course.campus}&pname=subjarea&tname=subj-course&course=${course.courseNumber}&sessyr=${course.sessionYear}&dept=${course.courseCode}`;
        const url = section.link;
        console.log(url)
        const res = await http.get(url);
        if(res.data !== undefined) {
            const $ = cheerio.load(res.data);
            $('body > div.container > div.content.expand')
                .each((i, el) => {

                    const term = $(el).children('b').first().text().trim();
                    const outlineSyllabus = $(el).children().eq(3).attr('href')
                    const description = $(el).children().eq(6).text()
                    const dayRaw = $(el).children().eq(17).text();
                    let dayAndTime = {};
                    for(const d in days) {
                        if(dayRaw.includes(days[d])) {
                            dayAndTime[days[d]] = {
                                'startIndex': dayRaw.indexOf(days[d]),
                                'endIndex': dayRaw.indexOf(days[d]) + 12
                            }
                        }
                    }

                    let classTimes = {
                        'days': [],
                        'startTimes': [],
                        'endTimes': []
                    };

                    for(const dt in dayAndTime) {
                        const str = dayRaw.substring(dayAndTime[dt].startIndex, dayAndTime[dt].endIndex + 1);
                        const day = str.substring(0, 3);
                        const startTime = str.substring(3, 8);
                        const endTime = str.substring(8, 13);

                        classTimes.days.push(day)
                        classTimes.startTimes.push(startTime)
                        classTimes.endTimes.push(endTime)
                    }
                    const instructor = $(el).children().eq(18).text().replace("Instructor:  ", "");
                    courseSectionsInfo[idx] = {
                        "name": section.name,
                        "title": section.title,
                        "description": description,
                        "instructor": instructor,
                        "activity": section.activity,
                        "term": term,
                        "credits": section.credits,
                        "prerequisites": section.prerequisites,
                        "outlineSyllabus": outlineSyllabus,
                        "classTimes": classTimes,
                        "building": 'No data',
                        "room": 'No data',
                        "faculty": section.faculty,
                        "link": section.link,
                        "sessionYear": section.sessionYear,
                        "sessionTerm": section.sessionTerm,
                    };
                    idx++;
                    //   console.log(idx + "/" + courses.length);
                })
        }
    }
    return courseSectionsInfo;
}

// scrapeCourseSectionsInfo([{
//     "_id": "60941f8d846f085a5cde6013",
//     "name": "COSC 121 101",
//     "title": "Computer Programming II",
//     "description": "description",
//     "activity": "Lecture",
//     "credits": 3,
//     "faculty": "Faculty of Arts and Sciences",
//     "prerequisites": "Noob",
//     "link": 'https://courses.students.ubc.ca/cs/courseschedule?sesscd=W&campuscd=UBCO&pname=subjarea&tname=subj-section&sessyr=2020&course=121&section=101&dept=COSC',
//     "sessionYear": 2021,
//     "sessionTerm": "W",
//     "__v": 0
// }]).then(r => {
// }).catch((r) => {
//     console.log(r)
// })

const grabSections = async(campus) => {
    const res = await http.get(`http://localhost:8000/${campus.toLowerCase() === "ubco" ? "ubco-courses" : "ubcv-courses"}`);
    // console.log(res.data)
    const scrapedData = await scrapeCourseSections(res.data)
    console.log(scrapedData)
    scrapedData.map((section, i) => {
        if(section !== undefined) {
            http.post(`http://localhost:8000/${campus.toLowerCase() === "ubco" ? "ubco-sections"
                : "ubcv-sections"}`, {
                "name": section.name,
                "title": section.title,
                "activity": section.activity,
                "credits": section.credits,
                "prerequisites": section.prerequisites,
                "faculty": section.faculty,
                "link": section.link,
                "sessionYear": section.sessionYear,
                "sessionTerm": section.sessionTerm,
            }).then(r => {
                const random = Math.floor(Math.random() * 2);
                if(random === 1) {
                    console.log('\x1b[36m%s\x1b[0m', 'Post successful');  //cyan
                } else {
                }
                console.log('\x1b[33m%s\x1b[0m', "Post successful");  //yellow
            })
                .catch((e) => {
                    console.log("failed")
                    console.log(e.message)
                })
        }
    })
}


// grabSections("UBCO").catch(r => {
//     console.log("some error")
//     console.log(r.message)
// })


const getCourses = () => {
    axios.get('http://localhost:8000/courses')
        .then(r => {
            r.data.map((el, i) => {
                console.log(el.courseName)
            })
        })

}
// scrapeSubjects("2021", "W", "UBCO")
// grabCourses("UBCO")
// grabSections()
