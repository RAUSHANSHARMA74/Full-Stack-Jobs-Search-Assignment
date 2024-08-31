import multer from 'multer';
import { bucket } from '../service/firebase.js';
import { v4 as uuidv4 } from 'uuid';

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFiles = upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'profile', maxCount: 1 }
]);

const uploadMiddleware = (req, res, next) => {
    uploadFiles(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error uploading files', error: err });
        }
        next();
    });
};

// Function to handle file uploads to Firebase Storage
export const handleFileUploads = async (req) => {
    let resumeUrl = '';
    let profileUrl = '';

    if (req.files && req.files.resume) {
        const resumeFile = req.files.resume[0];
        const resumeFileName = `resumes/${uuidv4()}-${resumeFile.originalname}`;
        const resumeFileRef = bucket.file(resumeFileName);

        await resumeFileRef.save(resumeFile.buffer, {
            metadata: { contentType: resumeFile.mimetype },
            public: true
        });

        resumeUrl = `https://storage.googleapis.com/${bucket.name}/${resumeFileName}`;
    }

    if (req.files && req.files.profile) {
        const profileFile = req.files.profile[0];
        const profileFileName = `profiles/${uuidv4()}-${profileFile.originalname}`;
        const profileFileRef = bucket.file(profileFileName);

        await profileFileRef.save(profileFile.buffer, {
            metadata: { contentType: profileFile.mimetype },
            public: true
        });

        profileUrl = `https://storage.googleapis.com/${bucket.name}/${profileFileName}`;
    }

    return { resumeUrl, profileUrl };
};

export default uploadMiddleware;
