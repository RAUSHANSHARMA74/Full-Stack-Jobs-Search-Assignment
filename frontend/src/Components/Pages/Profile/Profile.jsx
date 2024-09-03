import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
const api = import.meta.env.VITE_API_URL;

export default function Profile({ token, setToken }) {
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            // const token = JSON.parse(localStorage.getItem("token"));
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
                        setUserData(data.data);
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error fetching user data',
                        timer: 3000,
                        timerProgressBar: true
                    });
                }
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken("")
        Swal.fire({
            icon: 'success',
            title: 'Logged Out',
            text: 'You have been successfully logged out.',
            timer: 2000,
            timerProgressBar: true
        }).then(() => {
            navigate('/');
        });
    };
    return (
        <div className="profile_container">
            <div className="profile_show">
                <div className="profile_show_image_div">
                    <img className='profile_show_image' src={userData.profile} alt="User Profile" />
                </div>
                <div className="profile_name">
                    <label>Name:</label>
                    <p>{userData.name}</p>
                </div>
                <div className="profile_email">
                    <label>Email:</label>
                    <p>{userData.email}</p>
                </div>
                <div className="profile_gender">
                    <label>Gender:</label>
                    <p>{userData.gender}</p>
                </div>
                <div className="profile_workExperience">
                    <label>Work Experience:</label>
                    <p>{userData.workExperience}</p>
                </div>
                <div className="profile_linkedinProfile">
                    <label>LinkedIn Profile:</label>
                    <p>
                        <a href={userData.linkedinProfile} target="_blank" rel="noopener noreferrer">
                            Visit LinkedIn Profile
                        </a>
                    </p>
                </div>
                <div className="profile_resume">
                    <label>Resume:</label>
                    {userData.resume && (
                        <a href={userData.resume} target="_blank" rel="noopener noreferrer" className="download_button">
                            Download Resume
                        </a>
                    )}
                </div>
                <div className="logout">
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </div>
    );
}
