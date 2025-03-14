import React, { useState } from 'react';

const QuestionGroupView = ({ audio, questions, onAnswerUpdate, onNext }) => {
    const [selectedAnswers, setSelectedAnswers] = useState({}); // State để lưu câu trả lời đã chọn

    const handleAnswer = (questionId, answer) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: answer, // Lưu câu trả lời đã chọn
        }));
        // Gọi onAnswerUpdate ngay khi người dùng chọn câu trả lời
        const isCorrect = answer === questions.find(q => q.QuestionID === questionId).CorrectAnswer;
        onAnswerUpdate(isCorrect, questionId); // Truyền cả isCorrect và questionId
    };

    const handleNext = () => {
        setSelectedAnswers({}); // Reset lại câu trả lời đã chọn
        onNext(); // Chuyển đến câu hỏi tiếp theo
    };

    return (
        <div className="p-5 bg-white shadow-lg rounded-lg mb-4">
            {/* Hiển thị âm thanh nhóm câu hỏi */}
            {audio && (
                <audio controls className="w-full mb-4">
                    <source src={audio} type="audio/mpeg" />
                    Your browser does not support the audio tag.
                </audio>
            )}
            {questions.map((question) => (
                <div key={question.QuestionID} className="mb-4">
                    {question.QuestionImage && (
                        <img
                            src={question.QuestionImage}
                            alt="Question visual"
                            className="mb-4 w-full h-64 object-contain rounded-xl shadow-lg"
                        />
                    )}
                    <h3 className="p-5 bg-blue-300 rounded-xl text-lg font-normal">{question.QuestionText}</h3>
                    <div className="mt-4 space-y-2 bg-white">
                        {['A', 'B', 'C', 'D'].map((option) => (
                            question[`Answer${option}`] && question[`Answer${option}`] !== "NULL" && (
                                <li
                                    key={option}
                                    onClick={() => handleAnswer(question.QuestionID, option)}
                                    className={`p-2 cursor-pointer rounded-xl bg-blue-200 ${selectedAnswers[question.QuestionID] === option ? (question.CorrectAnswer === option ? 'bg-green-300' : 'bg-red-300') : ''}`}
                                >
                                    {question[`Answer${option}`]}
                                </li>
                            )
                        ))}
                    </div>
                </div>
            ))}
            <button
                onClick={handleNext}
                className="mt-4 p-2 bg-green-400 text-white rounded"
            >
                Câu tiếp theo
            </button>
        </div>
    );
};

export default QuestionGroupView;