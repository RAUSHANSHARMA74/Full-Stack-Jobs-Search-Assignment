import jwt from 'jsonwebtoken';

const authorization = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            next();
        } catch (error) {
            console.error("Token verification failed:", error);
            res.status(401).json({ status: 401, message: "Invalid or expired token. Please log in again." });
        }
    } else {
        res.status(401).json({ status: 401, message: "Not Authorization" });
    }
};

export default authorization;
