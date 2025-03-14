import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../hooks/UserContext'; // Import useUser

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState(''); // State for full name
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const navigate = useNavigate();
    const { setUser } = useUser(); // Lấy setUser từ context

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:3000/api/users');
            const users = response.data;

            const foundUser = users.find(user => user.Username === username && user.PasswordHash === password);

            if (foundUser) {
                const userData = {
                    id: foundUser.UserID,
                    username: foundUser.Username,
                    fullName: foundUser.FullName,
                    email: foundUser.Email,
                    role: foundUser.Role,
                };

                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData)); // Lưu thông tin người dùng

                if (foundUser.Role) {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                setErrorMessage('Username or password is incorrect.');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            console.error('Passwords do not match.');
            return;
        }

        try {
            const newUser = {
                username,
                email,
                password,
                fullName,
                role: 0
            };
            await axios.post('http://localhost:3000/api/users', newUser);
            setIsRegistering(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-600">
            {errorMessage && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out">
                    <span>{errorMessage}</span>
                </div>
            )}
            <div className="relative flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Login Section */}
                <div className={`transition-transform duration-500 ease-in-out w-1/2 bg-blue-500 text-white rounded-l-lg p-8 ${isRegistering ? '-translate-x-full' : 'translate-x-0'}`}>
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-left">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-white text-black"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-left">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-white text-black"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-white text-blue-500 p-2 rounded-md hover:bg-blue-100 transition"
                        >
                            Login
                        </button>
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => setIsRegistering(true)}
                                className="text-white text-right hover:underline"
                            >
                                Don`t have an account? Sign up
                            </button>
                        </div>
                    </form>
                </div>

                {/* Register Section */}
                <div className={`transition-transform duration-500 ease-in-out w-1/2 bg-purple-500 text-white rounded-r-lg p-8 ${isRegistering ? 'translate-x-0' : 'translate-x-full'}`}>
                    <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                    <form onSubmit={handleRegister}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-left">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-white text-black"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-left">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-white text-black"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-left">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-white text-black"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-left">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-white text-black"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-left">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-white text-black"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-white text-purple-500 p-2 rounded-md hover:bg-purple-100 transition"
                        >
                            Register
                        </button>
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => setIsRegistering(false)}
                                className="text-white text-left hover:underline"
                            >
                                Already have an account? Login
                            </button>
                        </div>
                    </form>
                </div>

                {/* Overlay with TOEIC MASTER */}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 w-1/2 ${isRegistering ? 'bg-purple-800' : 'bg-blue-800'} ${isRegistering ? '' : 'translate-x-full'}`}>
                    <h1 className={`text-4xl font-bold text-white`}>TOEIC MASTER</h1>
                </div>
            </div>
        </div>
    );
};

export default Login;