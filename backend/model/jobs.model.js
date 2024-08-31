import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    ctc: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        enum: ["Internship", "Full-Time", "Part-Time", "Contract"],
        required: true
    },
    workLocation: {
        type: String,
        enum: ["Remote", "On-Site", "Hybrid"],
        required: true
    },
    jobDescription: {
        type: String,
        required: true
    },
    skillsRequired: {
        type: [String],
        required: true
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    applicationDeadline: {
        type: Date,
        required: true
    },
    numberOfPositions: {
        type: Number,
        required: true
    }
});

const Jobs = mongoose.model('Jobs', jobsSchema);

export default Jobs;
