import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { FaAlignRight } from 'react-icons/fa';
import { BsXLg } from 'react-icons/bs';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
const api = import.meta.env.VITE_API_URL;


export default function Navbar({ token }) {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [userData, setUserData] = useState({});
    const [profile, setProfile] = useState(null);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (token && token.token) {
                try {
                    const response = await fetch(`${api}/api/user`, {
                        method: 'GET',
                        headers: {
                            'Authorization': token.token,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        // console.log(data.data.email, "data")
                        setUserData(data.data);
                        setProfile({
                            name: data.data.name,
                            image: data.data.profile
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error fetching user data',
                        timer: 3000,
                        timerProgressBar: true
                    });;
                }
            }
        };

        fetchUserData();
    }, [token]);

    return (
        <nav className="navbar">
            <div className="navbar_container">
                <Link to="/" className='logo_link'>
                    <div className="logo">
                        <img src="/company_logo.jpeg" alt="" />
                        <h1 className="logo">Kudosware</h1>
                    </div>
                </Link>
                <ul className={`menu_items ${isMenuOpen ? 'active' : ''}`}>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/jobs">Jobs</Link>
                    </li>
                    <li>
                        {profile && token ? (
                            <Link to="/profile" className='logo_link'>
                                <div className="profile">
                                    <img className='profile_image' src={profile.image} alt={profile.name} />
                                    <h1>{profile.name}</h1>
                                </div>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <span>Sign In</span>
                                </Link>
                                /
                                <Link to="/register">
                                    <span>Sign Up</span>
                                </Link>
                            </>
                        )}
                    </li>
                </ul>
                <div className="hamburger_lines" onClick={toggleMenu}>
                    {isMenuOpen ? <BsXLg /> : <FaAlignRight />}
                </div>
            </div>
        </nav>
    );
}
