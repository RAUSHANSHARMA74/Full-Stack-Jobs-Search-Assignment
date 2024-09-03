import React, { useState } from 'react';
import "./Register.css";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const api = import.meta.env.VITE_API_URL;

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        gender: '',
        profile: null,
        resume: null,
        password: '',
        workExperience: '',
        linkedinProfile: '',
    });

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        // Append text fields
        Object.keys(formData).forEach((key) => {
            if (key !== 'profile' && key !== 'resume') {
                data.append(key, formData[key]);
            }
        });

        // Append files
        if (formData.profile) data.append('profile', formData.profile);
        if (formData.resume) data.append('resume', formData.resume);

        try {
            const response = await fetch(`${api}/api/auth/register`, {
                method: 'POST',
                body: data
            });
            const result = await response.json();
            if (result.status == 201) {
                Swal.fire({
                    title: "Good job!",
                    text: result.message,
                    icon: "success"
                }).then(() => {
                    navigate('/login');
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data?.message || 'Error fetching user data',
                    timer: 3000,
                    timerProgressBar: true
                });
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="register_form form_container">
            <form onSubmit={handleSubmit}>
                <div className="form_group name">
                    <label htmlFor="name">Name <span className='red_star'>*</span></label>
                    <input type="text" name="name" id="name" onChange={handleInputChange} />
                </div>
                <div className="form_group email">
                    <label htmlFor="email">Email <span className='red_star'>*</span></label>
                    <input type="text" name="email" id="email" onChange={handleInputChange} />
                </div>
                <div className="form_group resume">
                    <label htmlFor="profile">Profile</label>
                    <input type="file" name="profile" id="profile" onChange={handleInputChange} />
                </div>
                <div className="form_group resume">
                    <label htmlFor="resume">Resume</label>
                    <input type="file" name="resume" id="resume" onChange={handleInputChange} />
                </div>
                <div className="form_group workExperience">
                    <label htmlFor="workExperience">Work Experience: Month <span className='red_star'>*</span></label>
                    <input type="number" name="workExperience" id="workExperience" onChange={handleInputChange} />
                </div>
                <div className="form_group gender">
                    <label htmlFor="gender">Gender</label>
                    <select name="gender" id="gender" onChange={handleInputChange}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div className="form_group linkedinProfile">
                    <label htmlFor="linkedinProfile">LinkedIn Profile</label>
                    <input type="text" name="linkedinProfile" id="linkedinProfile" onChange={handleInputChange} />
                </div>
                <div className="form_group password">
                    <label htmlFor="password">Password <span className='red_star'>*</span></label>
                    <div className="password_toggle">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            id="password"
                            placeholder='Password'
                            onChange={handleInputChange}
                        />
                        {showPassword ? (
                            <BsEye onClick={() => setShowPassword(false)} />
                        ) : (
                            <BsEyeSlash onClick={() => setShowPassword(true)} />
                        )}
                    </div>
                </div>
                <button type='submit' className='submit'>Submit</button>
            </form>
        </div>
    );
}
