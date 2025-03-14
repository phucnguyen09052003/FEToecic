import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import QuestionView from './QuestionView'; // Hiển thị từng câu hỏi
import QuestionGroupView from './QuestionGroupView'; // Hiển thị nhóm câu hỏi
import { useUser } from '../../hooks/UserContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const Progress = ({ totalCount, correctCount }) => {
    return (
        <div className="p-5 w-full shadow-xl border rounded-lg mb-4">
            <h3 className="font-bold text-lg">Tiến trình</h3>
            <p>
                Đã trả lời <span className="font-bold">{totalCount}</span> câu hỏi,
                trong đó <span className="text-green-500 font-bold">{correctCount}</span> câu đúng.
            </p>
        </div>
    );
};

const AnswerHistory = ({ history }) => {
    return (
        <div className="p-5 bg-gray-100 rounded-lg mb-4 h-96 overflow-scroll">
            <h4 className="font-bold">Lịch sử trả lời</h4>
            <ul className="space-y-2">
                {history.map((item, index) => (
                    <li
                        key={index}
                        className={`p-2 rounded-lg ${item.correct ? 'bg-green-300' : 'bg-red-300'}`}
                    >
                        Câu {index + 1}: {item.correct ? 'Đúng' : 'Sai'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

function ListeningQuestion() {
    const { user } = useUser();
    const { part } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestionGroupIndex, setCurrentQuestionGroupIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [history, setHistory] = useState([]);
    const [difficulty, setDifficulty] = useState(1);
    const [groupedQuestions, setGroupedQuestions] = useState([]);
    const [groupAudio, setGroupAudio] = useState(''); // State để lưu âm thanh

    const fetchQuestions = async () => {
        const partNumber = Number(part);
        try {
            const response = await axios.get(`http://localhost:3000/api/questions/part/${partNumber}`);
            const filteredQuestions = response.data.filter(question => question.ExamQuestion === false); // Lọc câu hỏi
            setQuestions(filteredQuestions); // Lưu những câu hỏi đã lọc
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu câu hỏi:', error);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [part]);

    useEffect(() => {
        // Nhóm câu hỏi theo QuestionGroupID
        const groups = questions.reduce((acc, question) => {
            if (!acc[question.QuestionGroupID]) {
                acc[question.QuestionGroupID] = [];
            }
            acc[question.QuestionGroupID].push(question);
            return acc;
        }, {});

        // Chỉ lấy các nhóm có 3 câu hỏi
        const filteredGroups = Object.values(groups).filter(group => group.length === 3);
        setGroupedQuestions(filteredGroups);
    }, [questions]);

    // Hàm để lấy âm thanh nhóm câu hỏi
    const fetchGroupAudio = async () => {
        if (groupedQuestions.length > 0) {
            const groupId = groupedQuestions[currentQuestionGroupIndex][0].QuestionGroupID; // ID của nhóm đầu tiên
            try {
                const response = await axios.get(`http://localhost:3000/api/questions/group/get/${groupId}`);
                setGroupAudio(response.data.Audio); // Lưu audio vào state
            } catch (error) {
                console.error('Lỗi khi lấy âm thanh nhóm câu hỏi:', error);
            }
        }
    };

    useEffect(() => {
        // Gọi hàm fetchGroupAudio khi phần là 3 hoặc 4
        if (part === '3' || part === '4') {
            fetchGroupAudio();
        }
    }, [part, groupedQuestions, currentQuestionGroupIndex]);


    const handleAnswerUpdate = async (isCorrect, questionId) => {
        setTotalCount((prev) => prev + 1);
        setHistory((prev) => [...prev, { questionId, correct: isCorrect }]); // Lưu questionId vào history
        if (isCorrect) {
            setCorrectCount((prev) => prev + 1);
        }
        try {
            const response = await axios.post('http://localhost:3000/api/users/question/create', {
                UserID: user.id,
                QuestionID: questionId,
                Saved: 0, // Luôn lưu Saved = 0
            });
        } catch (error) {
            console.error('Lỗi khi lưu câu hỏi người dùng:', error);
        }
    };

    const handleNext = () => {
        if (part === '1' || part === '2') {
            setCurrentQuestionIndex((prev) => prev + 1); // Chuyển đến câu hỏi tiếp theo
        } else {
            setCurrentQuestionGroupIndex((prev) => prev + 1); // Chuyển đến nhóm câu hỏi tiếp theo
        }
    };


    return (
        <>
            <Header />
            <div className="w-auto md:w-[64rem] m-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1 space-y-4">
                    <Progress totalCount={totalCount} correctCount={correctCount} />
                    <div className="p-5 bg-gray-100 rounded-lg">
                        <h4 className="font-bold mb-2">Chọn mức độ khó</h4>
                        <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(Number(e.target.value))}
                            className="p-2 border rounded-lg"
                        >
                            <option value={1}>Dễ</option>
                            <option value={2}>Trung bình</option>
                            <option value={3}>Khó</option>
                        </select>
                    </div>
                    <AnswerHistory history={history} />
                </div>

                <div className="col-span-2">
                    {part === '1' || part === '2' ? (
                        questions.length > 0 && currentQuestionIndex < questions.length && (
                            <QuestionView
                                question={questions[currentQuestionIndex]}
                                onAnswerUpdate={(isCorrect) => handleAnswerUpdate(isCorrect, questions[currentQuestionIndex].QuestionID)} // Cập nhật ở đây
                                onNext={handleNext}
                            />
                        )
                    ) : (
                        groupedQuestions.length > 0 && currentQuestionGroupIndex < groupedQuestions.length && (
                            <QuestionGroupView
                                questions={groupedQuestions[currentQuestionGroupIndex]}
                                audio={groupAudio}
                                onAnswerUpdate={(isCorrect, questionId) => handleAnswerUpdate(isCorrect, questionId)} // Cập nhật ở đây
                                onNext={handleNext}
                            />
                        )
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ListeningQuestion;