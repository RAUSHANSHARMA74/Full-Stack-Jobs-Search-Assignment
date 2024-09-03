import React, { useEffect, useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Navbar from '../Pages/Navbar/Navbar';
import Home from '../Pages/Home/Home';
import Login from '../Pages/Login/Login';
import Register from '../Pages/Register/Register';
import Nopage from '../Pages/Nopage/Nopage';
import Jobs from '../Pages/Jobs/Jobs';
import About from '../Pages/About/About';
import Profile from '../Pages/Profile/Profile';

export default function Router() {
    const [token, setToken] = useState()

    const tokenValue = JSON.parse(localStorage.getItem("token"));
    useEffect(() => {
        if (tokenValue) {
            setToken(tokenValue)
        } else {
            setToken(null)
        }

    }, [])

    return (
        <div>
            <Navbar token={token} />
            <Routes>
                <Route index element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/jobs" element={<Jobs token={token} />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile token={token} setToken={setToken} />} />
                <Route path="*" element={<Nopage />} />
            </Routes>
        </div>
    )
}
