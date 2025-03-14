import React, { useState } from 'react';

const QuestionView = ({ question, onAnswerUpdate, onNext }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null); // State để lưu câu trả lời đã chọn
    const [showAnswers, setShowAnswers] = useState(false); // State để điều khiển hiển thị đáp án

    const handleAnswer = (answer) => {
        setSelectedAnswer(answer); // Lưu câu trả lời đã chọn
    };

    const handleNext = () => {
        const isCorrect = selectedAnswer === question.CorrectAnswer; // Kiểm tra câu trả lời đúng
        onAnswerUpdate(isCorrect); // Gọi hàm cập nhật câu trả lời
        setSelectedAnswer(null); // Reset lại câu trả lời đã chọn
        setShowAnswers(false); // Giấu đáp án khi chuyển sang câu mới
        onNext(); // Chuyển đến câu hỏi tiếp theo
    };

    const toggleAnswerVisibility = () => {
        setShowAnswers(!showAnswers); // Chuyển đổi trạng thái hiển thị đáp án
    };

    return (
        <div className="p-5 bg-white shadow-lg rounded-lg mb-4">
            {question.QuestionImage && (
                <img
                    src={question.QuestionImage}
                    alt="Question visual"
                    className="mb-4 w-full h-64 object-contain rounded-xl shadow-lg" // Điều chỉnh kiểu dáng hình ảnh
                />
            )}
            {question.QuestionAudio && (
                <audio controls className="w-full mb-4">
                    <source src={question.QuestionAudio} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                </audio>
            )}
            <div>
                <h3 className="p-5 bg-blue-300 rounded-xl">{question.QuestionText}</h3>
                {/* Hiển thị đáp án A, B, C, D hoặc nội dung thực tế */}
                <ul className="mt-5 space-y-2 bg-white">
                    {['A', 'B', 'C', 'D'].map((option) => (
                        <li
                            key={option}
                            onClick={() => handleAnswer(option)}
                            className={`p-2 cursor-pointer rounded-xl bg-blue-200 ${selectedAnswer === option ? (question.CorrectAnswer === option ? 'bg-green-300' : 'bg-red-300') : ''}`}
                        >
                            {showAnswers ? question[`Answer${option}`] : option}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-between mt-4">
                <button
                    onClick={handleNext}
                    className="p-2 bg-green-400 text-white rounded"
                >
                    Câu tiếp theo
                </button>
                <button
                    onClick={toggleAnswerVisibility}
                    className={`p-2 ${showAnswers ? 'bg-red-400' : 'bg-blue-400'} text-white rounded`}
                >
                    {showAnswers ? 'Ẩn câu trả lời' : 'Xem câu trả lời'}
                </button>
            </div>
        </div>
    );
};

export default QuestionView;