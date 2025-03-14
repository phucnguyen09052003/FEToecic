import React, { useState, useEffect } from "react";
import { useUser } from '../../hooks/UserContext';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icon mắt

const AdminInfo = () => {
    const { user } = useUser();
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const fetchUserInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/users/${user.username}`);
            setUserInfo({
                fullName: response.data.FullName,
                email: response.data.Email,
                password: response.data.PasswordHash,
            });
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    };


    useEffect(() => {
        fetchUserInfo();
    }, [user.username]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/api/users/${user.username}`, userInfo);
            setMessage('Cập nhật thông tin thành công!');
            setIsModalOpen(false); // Đóng modal sau khi cập nhật
            fetchUserInfo();
        } catch (error) {
            console.error('Error updating information:', error);
            setMessage('Đã xảy ra lỗi trong quá trình cập nhật.');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col  h-screen bg-gray-200 p-4">
            <h1 className="text-3xl font-bold mb-4">Thông Tin Người Dùng</h1>
            {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="mb-4">
                    <label className=" text-2xl font-medium text-gray-700">Tên đăng nhập:   {user.username}</label>

                </div>

                <div className="mb-4">
                    <label className=" text-2xl font-medium text-gray-700">Vai trò: {user.role === true ? 'Quản trị viên' : 'Người dùng'}</label>

                </div>

                <div className="mb-4">
                    <label className=" text-2xl font-medium text-gray-700">Họ và Tên: {userInfo.fullName}</label>

                </div>

                <div className="mb-4">
                    <label className=" text-2xl font-medium text-gray-700">Email: {userInfo.email}</label>

                </div>

                <div className=" flex mb-4">
                    <label className="flex items-center text-2xl font-medium text-gray-700">
                        Mật khẩu: {showPassword ? userInfo.password : '********'}
                    </label>
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="ml-2 text-gray-500"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>

                <button
                    onClick={openModal}
                    className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200 text-2xl"
                >
                    Cập nhật thông tin
                </button>
            </div>

            {/* Modal for editing user information */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 relative w-full max-w-md">
                        <button onClick={closeModal} className="absolute top-2 right-2 text-red-500">X</button>
                        <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Họ Tên</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={userInfo.fullName}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userInfo.email}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                />
                            </div>

                            <div className="mb-4 relative">
                                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                                <div className="flex items-center">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={userInfo.password}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="w-1/12 left-full p-3.5 focus:outline-none"
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
                            >
                                Lưu thông tin
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInfo;