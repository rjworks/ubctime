const express = require('express');
const fs = require("fs");
const csv = require("csv-parse");
const path = require("path");
const router = express.Router();
const {Subject, Course, Section, SectionInfo} = require('../models/schema')
//routes for:
//get all sections
const find = async(schema, res, req) => {
    let data;
    const subj = req.params.subject;
    const courseNumber = req.params.courseNumber;
    const section = req.params.section;
    if(subj && courseNumber && section) {
        data = await schema.find({
            campus: req.params.campus.toUpperCase(),
            subject: req.params.subject.toUpperCase(),
            courseNumber: req.params.courseNumber.toUpperCase(),
            section: req.params.section.toUpperCase(),
        });
    } else if(subj && courseNumber) {
        data = await schema.find({
            campus: req.params.campus.toUpperCase(),
            subject: req.params.subject.toUpperCase(),
            courseNumber: req.params.courseNumber.toUpperCase()
        });
    } else if(subj) {
        data = await schema.find({
            campus: req.params.campus.toUpperCase(),
            subject: req.params.subject.toUpperCase()
        });
    } else {
        data = await schema.find({campus: req.params.campus.toUpperCase()});
    }
    return data;
}
// router.get('*', (req, res) => {
//     res.send('*crickets*') /* place as last route in your routes list */
// })

const getGrades = (req) => {
    const results = [];
    let campus = req.params.campus;
    const session = req.params.session;
    const subject = req.params.subject;
    const courseNumber = req.params.courseNumber;
    const section = req.params.section;
    campus = campus.toUpperCase();
    return new Promise((resolve, reject) => {
            if(campus && session && subject) {
                fs.createReadStream(`./grades/${campus}/${session}/${campus}-${session}-${subject.toUpperCase()}.csv`)
                    .on('error', (e) => {
                        reject(new Error("no record for that grades!"));
                    })
                    .pipe(csv())
                    .on('data', (data) => {
                        results.push({
                            campus: data[0],
                            session: data[1]+data[2],
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
                        // resolve(results);
                        if(courseNumber) {
                            resolve(results.filter(v => v.courseNumber.toUpperCase() === courseNumber.toUpperCase()));
                        } else if(courseNumber && section) {
                            resolve(results.filter(v => v.courseNumber.toUpperCase() === courseNumber.toUpperCase() && v.section.toUpperCase() === section.toUpperCase()));
                        } else {
                            resolve(results);
                        }
                    });
            }else{
                reject(new Error("uhh... it seems you're missing arguments...? +__+"));
            }
    })
}

// check if there's new data so we can update our data
router.get('/newData', (req, res) => {
    res.status(200).send({"newData": false})
})
// getting grades record
router.get('/:campus/grades/:session?/:subject?/:courseNumber?/:section?', async(req, res) => {
    let data;
    try{
        data = await getGrades(req);
    }catch(e){
        res.status(400).send(e.message);
    }

    res.status(200).send(data);
});

router.get('/:campus/:data/:subject?/:courseNumber?/:section?', async(req, res) => {
    let data;

    switch(req.params.data.toLowerCase()) {
        case "subjects":
            data = await find(Subject, res, req);
            break;
        case "courses":
            data = await find(Course, res, req);
            break;
        case "sections":
            data = await find(Section, res, req);
            break;
        case "sections-info":
            data = await find(SectionInfo, res, req);
            break;
    }
    res.status(200).send(data);
});

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../apiUsage.html'));
    // res.send([
    //     {
    //         "GET SUBJECTS": '/:campus/subjects/:subject?',
    //         "GET ALL SUBJECTS EXAMPLE": '/ubcv/subjects/',
    //         "GET ALL SUBJECTS WITH SUBJECT FILTER": '/ubco/subjects/cosc'
    //     },
    //     {
    //         "GET COURSES": '/:campus/courses/:subject?/:courseNumber?',
    //         "GET ALL COURSES EXAMPLE": '/ubcv/courses',
    //         "GET ALL COURSES WITH SUBJECT FILTER": '/ubcv/courses/cpsc',
    //         "GET ALL COURSES WITH SUBJECT AND COURSE NUMBER FILTER": '/ubco/courses/cosc/121',
    //     },
    //     {
    //         "GET SECTIONS INFO": '/:campus/courses/:subject?/:courseNumber?/:section?',
    //         "GET ALL SECTIONS INFO EXAMPLE": '/ubcv/sections-info/',
    //         "GET ALL SECTIONS INFO WITH SUBJECT FILTER": '/ubcv/sections-info/cpsc',
    //         "GET ALL SECTIONS INFO WITH SUBJECT AND COURSE NUMBER FILTER": '/ubco/sections-info/cosc/121',
    //         "GET ALL SECTIONS INFO WITH SUBJECT, COURSE NUMBER, and SECTION FILTER": '/ubco/sections-info/cosc/121/101',
    //     }
    // ])
})
//create one
// router.post('/:campus/:data/', async(req, res) => {
//     let data;
//     switch(req.params.data) {
//         case "subjects":
//             data = new Subject({
//                 subject: req.body.subject,
//                 title: req.body.title,
//                 faculty: req.body.faculty,
//                 session: req.body.session,
//                 campus: req.body.campus
//             });
//             break;
//         case "courses":
//             data = new Course({
//                 course: req.body.course,
//                 subject: req.body.subject,
//                 courseNumber: req.body.courseNumber,
//                 title: req.body.title,
//                 prerequisites: req.body.prerequisites,
//                 faculty: req.body.faculty,
//                 sections: req.body.sections,
//                 link: req.body.link,
//                 session: req.body.session,
//                 campus: req.body.campus.toUpperCase()
//             });
//             break;
//         case "sections":
//             data = new Section({
//                 section: req.body.section,
//                 activity: req.body.activity,
//                 session: req.body.session,
//                 campus: req.body.campus.toUpperCase()
//             });
//             break;
//         case "sections-info":
//             data = new SectionInfo({
//                 activity: req.body.activity,
//                 course: req.body.course,
//                 courseNumber: req.body.courseNumber,
//                 subject: req.body.subject,
//                 section: req.body.section,
//                 title: req.body.title,
//                 description: req.body.description,
//                 instructor: req.body.instructor,
//                 requiresInPersonAttendance: req.body.requiresInPersonAttendance,
//                 modeOfDelivery: req.body.modeOfDelivery,
//                 term: req.body.term,
//                 credits: req.body.credits,
//                 prerequisites: req.body.prerequisites,
//                 classTimes: req.body.classTimes,
//                 faculty: req.body.faculty,
//                 link: req.body.link,
//                 session: req.body.session,
//                 campus: req.body.campus.toUpperCase()
//             });
//             break;
//     }
//     if(data === undefined) {
//         res.status(400).send("*crickets*")
//         return;
//     }
//     const newData = await data.save();
//     res.status(201).json(newData)
// });
//updating one
// router.patch('/:campus/:sessionYear/:path/:id', getData, async(req, res) => {
//     // if(res.schema.sectionName != null){
//     //     res.schema.sectionName = req.body.sectionName;
//     // }
//     try {
//         const updateSection = await res.schema.save();
//         res.json(updateSection);
//     } catch(e) {
//         res.status(400).json({message: e.message})
//     }
// });
//deleting one
// router.delete('/:id', getData, async(req, res) => {
//     try {
//         await res.schema.remove();
//         res.json({message: "Deleted section"});
//     } catch(e) {
//         res.status(500).json({message: e.message});
//     }
// });

async function getData(req, res, next) {
    let data;
    try {
        data = await Schema.findById(req.params.id);
        if(data == null) {
            return req.status(404).json({message: "Cannot find data"});
        }
    } catch(e) {
        return res.status(500).json({message: e.message});
    }

    res.schema = data;
    next();
}

module.exports = router;