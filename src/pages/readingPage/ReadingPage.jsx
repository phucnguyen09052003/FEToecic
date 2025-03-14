import PartItem from "../../components/PartItem";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../../components/header";
import Footer from "../../components/Footer";
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/UserContext';
function ReadingPage() {
    const { user } = useUser();
    const [stats, setStats] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {  
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/questions/user-question-stats/${user.id}`);
                console.log("Fetched data:", response.data); // Kiểm tra dữ liệu
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleClick = (partId) => {
        navigate(`/reading/part/${partId}`);
    };
    const filteredStats = stats.filter(stat => stat.PartID >= 5 );
    return (
        <>
            <Header />
            <div className="m-auto max-w-7xl p-6">
                {/* Tiêu đề chính */}
                <h1 className="text-4xl font-bold text-center mb-6">Câu Hỏi Đọc Hiểu</h1>
                <p className="text-center text-lg mb-10">
                    Trong phần này, bạn sẽ làm bài kiểm tra về kỹ năng đọc hiểu. Hãy chắc chắn rằng bạn đã chuẩn bị sẵn sàng!
                </p>

                {/* Danh sách các phần */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredStats.map(stat => (
                        <div
                            key={stat.PartID}
                            onClick={() => handleClick(stat.PartID)} // Sử dụng hàm handleClick
                        >
                            <PartItem
                                id={stat.PartID}
                                title={stat.Title}
                                number={stat.TotalQuestions}
                                learned={stat.CompletedQuestions}
                                incorrect={stat.IncorrectQuestions}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ReadingPage;