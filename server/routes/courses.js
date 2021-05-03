const express = require('express');
const router = express.Router();
const Course  = require('../models/course');
//routes for:
//get all courses
router.get('/', async (req, res) => {
    try{
        const courses = await Course.find();
        res.send(courses);
    }catch(e){
        res.status(500).res.json({message: e.message});
    }
});
//get one
router.get('/:id', getCourse, (req, res) => {
    res.json(res.course);
});
//create one
router.post('/', async (req, res) => {
    const course = new Course({
        course: req.body.course,
        section: req.body.section,
        professor: req.body.professor,
        faculty: req.body.faculty,
        location: req.body.location,
        link: req.body.link,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });

    try{
        const newCourse = await course.save();
        res.status(201).json(newCourse)
    }catch(e){
        res.status(400).json({message: e.message});
    }
});
//updating one
router.patch('/:id',  getCourse, async (req, res) => {
    if(res.course.course != null){
        res.course.course = req.body.course;
    }
    if(res.course.section != null){
        res.course.section = req.body.section;
    }
    if(res.course.professor != null){
        res.course.professor = req.body.professor;
    }
    if(res.course.faculty != null){
        res.course.faculty = req.body.faculty;
    }
    if(res.course.location != null){
        res.course.location = req.body.location;
    }
    if(res.course.link != null){
        res.course.link = req.body.link;
    }
    if(res.course.startDate != null){
        res.course.startDate = req.body.startDate;
    }
    if(res.course.endDate != null){
        res.course.endDate = req.body.endDate;
    }

    try{
        const updatedCourse = await res.course.save();
        res.json(updatedCourse);
    }catch(e){
        res.status(400).json({message: e.message})
    }
});
//deleting one
router.delete('/:id', getCourse, async(req, res) => {
    try{
        await res.course.remove();
        res.json({message: "Delete course"});
    }catch(e){
        res.status(500).json({message: e.message});
    }
});

async function getCourse(req, res, next) {
    let course;
    try{
        course = await Course.findById(req.params.id);
        if(course == null){
            return req.status(404).json({message: "Cannot find course"});
        }
    }catch(e){
        return res.status(500).json({message: e.message});
    }

    res.course = course;
    next();
}

module.exports = router;