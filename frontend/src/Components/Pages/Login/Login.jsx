import React, { useState } from 'react';
import "./Login.css";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const api = import.meta.env.VITE_API_URL;


export default function Login({ setToken }) {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null); // To handle and display errors

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${api}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.status == 200) {
                localStorage.setItem("token", JSON.stringify(data))
                const tokenValue = JSON.parse(localStorage.getItem("token"));
                setToken(tokenValue)
                Swal.fire({
                    title: "Good job!",
                    text: data.message,
                    icon: "success"
                }).then(() => {
                    navigate('/');
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
            setError(error.message); // Set error message to display
        }
    };

    return (
        <div className="form_container">
            <form className='login_form' onSubmit={handleSubmit}>
                <div className="login_form_group email">
                    <label htmlFor="email">Email <span className='red_star'>*</span></label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="login_form_group password">
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
                <button type='submit' className='login_submit'>Login</button>
                {error && <p className="error_message">{error}</p>} {/* Display error message */}
            </form>
        </div>
    );
}
