import express from "express"
import {
    retrieve_all_jobs,
    add_bulk_jobs,
    apply,
    getUser
} from "../controller/user.controller.js";
const route = express.Router();


route.get("/jobs", retrieve_all_jobs);
route.get("/user", getUser);
route.post("/jobs", apply);
route.post("/bulk", add_bulk_jobs);


export default route
