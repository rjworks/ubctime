const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    course: {
        type: String,
        required: true
    },
    section: {
        type: Number,
        required: true
    },
    professor: {
        type: String,
        required: true
    },
    faculty: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Course', courseSchema);