import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../model/user.model.js";
import { handleFileUploads } from '../middleware/uploadFile.js';
//REGISTER USERS
export const register = async (req, res) => {
    const {
        name,
        email,
        workExperience,
        gender,
        linkedinProfile,
        password
    } = req.body;

    const normalizedEmail = email?.toLowerCase().trim();
    if (!normalizedEmail || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const hashPassword = await bcrypt.hash(password, 6);

        // Handle file uploads and get URLs
        const { resumeUrl, profileUrl } = await handleFileUploads(req);

        // Create a new user
        const newUser = await User.create({
            name,
            email: normalizedEmail,
            resume: resumeUrl,
            profile: profileUrl,
            workExperience,
            gender,
            linkedinProfile,
            password: hashPassword
        });

        res.status(201).json({ message: "Signup successful", data: newUser });
    } catch (error) {
        console.error("Something went wrong during user registration:", error);
        res.status(500).json({ message: "An error occurred during registration" });
    }
};


//LOGIN USERS
export const login = async (req, res) => {
    const { email, password } = req.body;
    const trimmedEmail = email.trim();

    try {
        const existingUser = await User.findOne({ email: trimmedEmail });
        if (!existingUser) {
            return res.status(400).json({ message: "User not found. Please sign up." });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            status: 200,
            message: "Login successful",
            name: existingUser.name,
            token,
        });
    } catch (error) {
        console.error("Something went wrong during login:", error);
        return res.status(500).json({ message: "An error occurred during login" });
    }
};

