const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true
};

const reqObj = {type: {}, required: true};
const reqArr = {type: [], required: true};

const subject = new mongoose.Schema({
    subject: reqString,
    title: reqString,
    faculty: reqString,
    session: reqString,
    campus: reqString
})
const course = new mongoose.Schema({
    course: reqString,
    subject: reqString,
    courseNumber: reqString,
    title: reqString,
    faculty: reqString,
    sections: reqArr,
    link: reqString,
    session: reqString,
    campus: reqString
})

const section = new mongoose.Schema({
    section: reqString,
    activity: reqString,
    session: reqString,
    campus: reqString
})

const sectionInfo = new mongoose.Schema({
    section: reqString,
    title: reqString,
    description: reqString,
    instructor: reqString,
    activity: reqString,
    credits: reqString,
    term: reqString,
    building: reqString,
    room: reqString,
    classTimes: reqObj,
    session: reqString,
    campus: reqString
})

exports.Subject = mongoose.model("Subject", subject, "subjects2021W");
exports.Course = mongoose.model('Course', course, "courses2021W")
exports.Section = mongoose.model('Section', section, "sections2021W")
// exports.SectionInfo = mongoose.model('SectionInfo', sectionInfo, "Subjects2021W")