import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const Question = ({ onAnswerUpdate, data }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    useEffect(() => {
        setSelectedAnswer(null);
    }, [data]);

    const question = data;

    const handleClick = (Answer) => {
        setSelectedAnswer(Answer);
        if (selectedAnswer === null)
            onAnswerUpdate(Answer === question.CorrectAnswer); // Gọi hàm update từ QuestionPart
    };

    return (
        <>
            <div>
                {question && (
                    <div className="space-y-4">
                        {/* 1. Hiển thị âm thanh */}
                        {question.QuestionAudio && (
                            <div>
                                <audio controls className="w-full">
                                    <source src={question.QuestionAudio} type="audio/mpeg" />
                                    Trình duyệt của bạn không hỗ trợ phát âm thanh.
                                </audio>
                            </div>
                        )}

                        {/* 2. Hiển thị hình ảnh */}
                        {question.QuestionImage && (
                            <div>
                                <img
                                    src={question.QuestionImage}
                                    alt="Question Illustration"
                                    className="w-full h-64 object-contain rounded-xl shadow-lg"
                                />
                            </div>
                        )}

                        {/* 3. Hiển thị câu hỏi */}
                        <div>
                            <h3 className="p-5 bg-blue-300">{question.QuestionText}</h3>
                            <ul className="mt-5 space-y-2 bg-white">
                                <li
                                    className={`p-2 cursor-pointer rounded-xl bg-blue-200 ${selectedAnswer === 'A' ? (question.CorrectAnswer === 'A' ? 'bg-green-300' : 'bg-red-300') : ''}`}
                                    onClick={() => handleClick('A')}
                                >
                                    {question.AnswerA}
                                </li>
                                <li
                                    className={`p-2 cursor-pointer rounded-xl bg-blue-200 ${selectedAnswer === 'B' ? (question.CorrectAnswer === 'B' ? 'bg-green-300' : 'bg-red-300') : ''}`}
                                    onClick={() => handleClick('B')}
                                >
                                    {question.AnswerB}
                                </li>
                                <li
                                    className={`p-2 cursor-pointer rounded-xl bg-blue-200 ${selectedAnswer === 'C' ? (question.CorrectAnswer === 'C' ? 'bg-green-300' : 'bg-red-300') : ''}`}
                                    onClick={() => handleClick('C')}
                                >
                                    {question.AnswerC}
                                </li>
                                <li
                                    className={`p-2 cursor-pointer rounded-xl bg-blue-200 ${selectedAnswer === 'D' ? (question.CorrectAnswer === 'D' ? 'bg-green-300' : 'bg-red-300') : ''}`}
                                    onClick={() => handleClick('D')}
                                >
                                    {question.AnswerD}
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Hiển thị giải thích nếu câu trả lời đã chọn */}
                {selectedAnswer && !question.ExamQuestion && (
                    <div className="my-8 h-36 w-full">
                        <p className="bg-blue-400 text-white h-36 p-4 rounded-xl">
                            Giải thích: {question.Explanation}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Question;
