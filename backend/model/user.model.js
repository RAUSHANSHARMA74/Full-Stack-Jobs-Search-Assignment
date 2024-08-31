import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other'],
        trim: true
    },
    profile: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    applied: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Jobs"
        }
    ],
    workExperience: {
        type: Number,
        required: true
    },
    linkedinProfile: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

export default User;
