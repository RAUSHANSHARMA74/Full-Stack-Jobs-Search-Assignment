import React from 'react'
import { Routes, Route } from "react-router-dom";
import Navbar from '../Pages/Navbar/Navbar';
import Home from '../Pages/Home/Home';
import Login from '../Pages/Login/Login';
import Register from '../Pages/Register/Register';
import Nopage from '../Pages/Nopage/Nopage';
import Jobs from '../Pages/Jobs/Jobs';
import About from '../Pages/About/About';

export default function Router() {
    return (
        <div>
            <Navbar />
            <Routes>
                <Route index element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<Nopage />} />
            </Routes>
        </div>
    )
}
