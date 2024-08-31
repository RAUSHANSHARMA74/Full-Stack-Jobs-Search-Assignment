export default validateRegister = (req, res, next) => {
    const { id, first_name, last_name, email, gender, avatar, domain, available, password } = req.body;
    if (!id || !first_name || !last_name || !email || !gender || !avatar || !domain || available === undefined || !password) {
        return res.status(400).json({ message: "Please provide all required details." });
    }
    next();
};
