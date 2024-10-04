// src/components/Login.jsx

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // State variables
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [surname, setSurname] = useState(''); // Added for sign-up
    const [age, setAge] = useState('');           // Added for sign-up
    const [message, setMessage] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const navigate = useNavigate();
    const formRef = useRef(null);

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await axios.post('http://localhost:8000/login', {
                name,
                password,
            });

            if (response.status === 200) {
                localStorage.setItem('loggedInUser', name); // Save the logged-in user
                setMessage("Login successful!");
                navigate('/'); // Navigate to the home page
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage("Network error. Please try again.");
            }
        }
    };

    // Handle Sign-Up
    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevent default form submission
        try {
            const response = await axios.post('http://localhost:8000/addUser', {
                name,
                password,
                surname, // Include if required
                age,      // Include if required
            });

            if (response.status === 201) {
                setMessage("User created successfully!");
                setIsSignUp(false);
                // Optionally, navigate to login or clear form fields
                setName('');
                setPassword('');
                setSurname('');
                setAge('');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage("Network error. Please try again.");
            }
        }
    };

    // Toggle between Sign-In and Sign-Up
    const handleToggle = () => {
        setIsSignUp((prevState) => !prevState);
        setMessage(''); // Clear any existing messages
    };

    return (
        <div ref={formRef} className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={isSignUp ? handleSignUp : handleLogin}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
            >
                <h1 className="text-2xl font-bold mb-6 text-gray-800">
                    {isSignUp ? "Sign Up" : "Sign In"}
                </h1>
                
                {/* Name Input */}
                <input
                    type="text"
                    placeholder="Username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                {/* Password Input */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                {/* Additional Fields for Sign-Up */}
                {isSignUp && (
                    <>
                        {/* Surname Input */}
                        <input
                            type="text"
                            placeholder="Surname"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />

                        {/* Age Input */}
                        <input
                            type="number"
                            placeholder="Age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </>
                )}

                {/* Message Display */}
                {message && (
                    <p
                        className={`block mb-4 ${
                            message.includes("successful") ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                        {message}
                    </p>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full text-white py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                        isSignUp
                            ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                            : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
                    }`}
                >
                    {isSignUp ? "Sign Up" : "Sign In"}
                </button>

                {/* Toggle Between Sign-In and Sign-Up */}
                <div className="flex gap-2 mt-6 justify-center">
                    <p>{isSignUp ? "Already have an account?" : "Don't have an account?"}</p>
                    <button
                        onClick={handleToggle}
                        type="button"
                        className="text-blue-600 hover:underline"
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;
