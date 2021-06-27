const express = require('express');
const router = express.Router();
const {Subject, Course, Section, SectionInfo} = require('../models/schema')
//routes for:
//get all sections
const find = async(schema, res, req) => {
    let data;
    const subj = req.params.subject;
    if(subj){
        data = await schema.find({
            campus: req.params.campus.toUpperCase(),
            subject: req.params.subject.toUpperCase(),
        });
    }else{
        data = await schema.find({campus: req.params.campus.toUpperCase()});
    }
    return data;
}
// router.get('*', (req, res) => {
//     res.send('*crickets*') /* place as last route in your routes list */
// })
router.get('/:campus/:data/:subject?', async(req, res) => {
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
//create one
router.post('/:campus/:data', async(req, res) => {
    let data;
    switch(req.params.data) {
        case "subjects":
            data = new Subject({
                subject: req.body.subject,
                title: req.body.title,
                faculty: req.body.faculty,
                session: req.body.session,
                campus: req.body.campus
            });
            break;
        case "courses":
            data = new Course({
                course: req.body.course,
                subject: req.body.subject,
                courseNumber: req.body.courseNumber,
                title: req.body.title,
                faculty: req.body.faculty,
                sections: req.body.sections,
                link: req.body.link,
                session: req.body.session,
                campus: req.body.campus.toUpperCase()
            });
            break;
        case "sections":
            data = new Section({
                section: req.body.section,
                activity: req.body.activity,
                session: req.body.session,
                campus: req.body.campus.toUpperCase()
            });
            break;
        case "sections-info":
            data = new SectionInfo({
                section: req.body.section,
                title: req.body.title,
                description: req.body.description,
                instructor: req.body.instructor,
                activity: req.body.activity,
                credits: req.body.activity,
                term: req.body.term,
                building: req.body.building,
                room: req.body.room,
                classTimes: req.body.classTimes,
                session: req.body.session,
                campus: req.body.campus.toUpperCase()
            });
            break;
    }
    if(data === undefined) {
        res.status(400).send("*crickets*")
        return;
    }
    const newData = await data.save();
    res.status(201).json(newData)
});
//updating one
router.patch('/:campus/:sessionYear/:path/:id', getData, async(req, res) => {
    // if(res.schema.sectionName != null){
    //     res.schema.sectionName = req.body.sectionName;
    // }
    try {
        const updateSection = await res.schema.save();
        res.json(updateSection);
    } catch(e) {
        res.status(400).json({message: e.message})
    }
});
//deleting one
router.delete('/:id', getData, async(req, res) => {
    try {
        await res.schema.remove();
        res.json({message: "Deleted section"});
    } catch(e) {
        res.status(500).json({message: e.message});
    }
});

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