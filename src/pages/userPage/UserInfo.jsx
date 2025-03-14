import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import SuccessMessage from "../../AdminArea/components/SuccessMessage";
import FailMessage from "../../AdminArea/components/FailMessage";
import { useUser } from '../../hooks/UserContext';
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [userInfo, setUserInfo] = useState({
        fullName: '',
        email: '',
        password: '',
        role: false,
        username: user.username
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [examHistory, setExamHistory] = useState([]);
    const [savedQuestions, setSavedQuestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');
    const [failMessage, setFailMessage] = useState('');
    const pageSize = 5;

    useEffect(() => {




        // Fetch thông tin người dùng
        axios.get(`http://localhost:3000/api/users/${user.username}`)
            .then((response) => {
                const { Email, FullName, PasswordHash, Role } = response.data;
                setUserInfo({
                    fullName: FullName,
                    email: Email,
                    password: PasswordHash,
                    role: Role,
                    username: user.username
                });
            });

        // Fetch lịch sử thi
        fetchExamHistory(user.id, currentPage);

        // Fetch từ vựng đã lưu
        axios.get(`http://localhost:3000/api/vocabulary/user/${user.id}`).then((response) => {
            setSavedVocabulary(response.data);
        });

        // Fetch câu hỏi đã lưu
        axios.get(`http://localhost:3000/api/saved-questions/user/${user.id}`).then((response) => {
            setSavedQuestions(response.data);
        });
    }, [currentPage, user.username]);

    const fetchExamHistory = async (userId, page) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/results/user/${user.id}`, {
                params: { page, pageSize }
            });
            console.log(response.data.results);
            setExamHistory(response.data.results);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.log(`${error.message}`);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (userInfo.password !== confirmPassword) {
            setMessage('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }
        try {
            await axios.put(`http://localhost:3000/api/users/${user.username}`, {
                ...userInfo,
                password: userInfo.password // Chỉ gửi mật khẩu chính
            });
            setSuccessMessage('Thông tin đã được cập nhật thành công!');
        } catch (error) {
            setFailMessage('Đã xảy ra lỗi trong quá trình cập nhật.', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(prevState => !prevState);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const closeSuccessMessage = () => setSuccessMessage('');
    const closeFailMessage = () => setFailMessage('');
    const handleSavedQuestion = () => {
        // Truyền thông tin bài thi qua state
        navigate(`/saved/${user.id}`);
    };
    return (
        <>
            <Header />
            <div className="container mx-auto p-8">
                {/* Hiển thị thông báo thành công */}
                <SuccessMessage message={successMessage} onClose={closeSuccessMessage} />
                {/* Hiển thị thông báo thất bại */}
                <FailMessage message={failMessage} onClose={closeFailMessage} />

                <div className="grid grid-cols-2 gap-8">
                    {/* Cột thông tin người dùng */}
                    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                        <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
                            {message && <p className="text-red-500 mb-4">{message}</p>}

                            <div>
                                <label className="block text-lg font-medium text-left">Tên đăng nhập:</label>
                                <div className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-gray-100">
                                    {userInfo.username}
                                </div>
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-left">Vai trò:</label>
                                <div className="mt-1 p-2 border border-gray-300 rounded-md w-full bg-gray-100">
                                    {userInfo.role ? 'Quản trị viên' : 'Người dùng'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-left">Họ và Tên:</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={userInfo.fullName}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-lg font-medium text-left">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userInfo.email}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                />
                            </div>

                            <div className="relative">
                                <label className="block text-lg font-medium text-left">Mật khẩu:</label>
                                <div className="flex items-center">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={userInfo.password}
                                        onChange={handleChange}
                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full pr-10"
                                        required
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

                            <div className="relative">
                                <label className="block text-lg font-medium text-left">Xác nhận mật khẩu:</label>
                                <div className="flex items-center">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={handleConfirmPasswordChange}
                                        className="mt-1 p-2 border border-gray-300 rounded-md w-full pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="w-1/12 left-full p-3.5 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                            >
                                Cập nhật thông tin
                            </button>
                        </form>
                    </div>

                    {/* Cột ôn tập */}
                    <div className="bg-white shadow rounded-lg p-6">
                        {/* Lịch sử thi */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-semibold mb-4">Lịch Sử Thi</h2>
                            <div className="h-52">
                                {examHistory.length > 0 ? (
                                    <ul>
                                        {examHistory.map((exam) => (
                                            <li key={exam.ResultID} className="border-b py-2">
                                                <b>Bài thi:</b> {exam.ExamID} - <b>Điểm:</b> {exam.Score} - <b>Ngày:</b> {exam.CompletedDate}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Chưa có lịch sử thi nào.</p>
                                )}
                            </div>

                            {/* Phân trang */}
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                >
                                    Trang trước
                                </button>
                                <span>
                                    Trang {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                                >
                                    Trang sau
                                </button>
                            </div>
                        </div>




                        <h2 className="text-xl font-semibold mb-4">Câu Hỏi Đã Lưu</h2>
                        <div onClick={handleSavedQuestion}>
                            Ôn tập
                        </div>


                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserInfo;