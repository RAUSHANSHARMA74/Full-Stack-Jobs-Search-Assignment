import express from "express"
import { register, login } from "../controller/auth.controller.js";
import uploadMiddleware from "../middleware/uploadFile.js";
const auth = express.Router()

auth.post('/register', uploadMiddleware, register);
auth.post('/login', login);


export default auth