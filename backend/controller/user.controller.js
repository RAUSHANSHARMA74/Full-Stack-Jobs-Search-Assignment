import Jobs from "../model/jobs.model.js";
import User from "../model/user.model.js";

//ADD BULK jobs 
export const add_bulk_jobs = async (req, res) => {
    try {
        const jobs = req.body;

        if (!Array.isArray(jobs) || jobs.length === 0) {
            return res.status(400).json({ message: 'Invalid input: Expected an array of job objects' });
        }

        const result = await Jobs.insertMany(jobs);

        res.status(201).json({
            status: 201,
            message: 'Jobs added successfully',
            count: result.length,
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error: Failed to add jobs' });
    }
};

export const getUser = async (req, res) => {
    try {
        const currentUserId = req.userId;

        if (!currentUserId) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid request: Missing required fields'
            });
        }
        const user = await User.findById(currentUserId);

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found'
            });
        }

        res.status(200).json({
            status: 200,
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            status: 500,
            message: 'Server error: Failed to get user'
        });
    }
};

//RETRIEVE ALL USERS BY SEARCH WITH LIMIT AND PAGE
export const retrieve_all_jobs = async (req, res) => {
    try {
        const { page = 1, limit = 20, text = '' } = req.query;

        const pageNumber = parseInt(page, 10);
        const pageLimit = parseInt(limit, 10);

        if (pageNumber < 1 || pageLimit < 1) {
            return res.status(400).json({ message: 'Invalid pagination parameters' });
        }

        const skip = (pageNumber - 1) * pageLimit;

        const filter = {};

        if (text) {
            filter.$or = [
                { company: { $regex: text, $options: 'i' } },
                { ctc: { $regex: text, $options: 'i' } },
                { jobType: { $regex: text, $options: 'i' } },
                { workLocation: { $regex: text, $options: 'i' } },
                { skillsRequired: { $regex: text, $options: 'i' } },
                { jobDescription: { $regex: text, $options: 'i' } },
            ];
        }

        const [jobs, totalJobs] = await Promise.all([
            Jobs.find(filter)
                .skip(skip)
                .limit(pageLimit)
                .exec(),
            Jobs.countDocuments(filter).exec()
        ]);

        const totalPages = Math.ceil(totalJobs / pageLimit);

        res.status(200).json({
            status: 200,
            message: "Successfully retrieved filtered data",
            totalJobs,
            totalPages,
            currentPage: pageNumber,
            pageSize: pageLimit,
            data: jobs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Server error: Failed to retrieve jobs' });
    }
};



export const apply = async (req, res) => {
    try {
        const companyId = req.body.id;
        const currentUserId = req.userId;

        if (!companyId || !currentUserId) {
            return res.status(400).json({ message: 'Invalid request: Missing required fields' });
        }

        const user = await User.findById(currentUserId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.applied.includes(companyId)) {
            user.applied.push(companyId);
        } else {
            return res.status(400).json({ status: 400, message: 'Company already applied by user' });
        }

        await user.save();

        res.status(200).json({
            status: 200,
            message: 'Applied successfully to user',
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: Failed to add company to user' });
    }
};
