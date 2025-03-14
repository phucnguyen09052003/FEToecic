import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from '../../hooks/UserContext';
const SavedQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [totalSaved, setTotalSaved] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  useEffect(() => {
    const fetchSavedQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/users/question/saved/${user.id}`);
        console.log(response);
        setQuestions(response.data);
        setTotalSaved(response.data.totalSavedQuestions);
      } catch (error) {
        console.error("Error fetching saved questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedQuestions();
  }, [user.id]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Danh sách câu hỏi đã lưu</h1>
      <p className="text-gray-600 mb-6">Tổng số câu hỏi đã lưu: {totalSaved}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {questions.map((question) => (
          <div
            key={question.QuestionID}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200 hover:shadow-lg transition duration-300"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Câu hỏi #{question.QuestionID}
              </h2>
              {question.QuestionText && (
                <p className="text-gray-600">{question.QuestionText}</p>
              )}
              {question.QuestionAudio && (
                <audio controls className="mt-2">
                  <source src={question.QuestionAudio} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              )}
              {question.QuestionImage && (
                <img
                  src={question.QuestionImage}
                  alt={`Question ${question.QuestionID}`}
                  className="mt-2 w-full h-40 object-cover rounded"
                />
              )}
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500 font-medium">Đáp án:</p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>A: {question.AnswerA}</li>
                <li>B: {question.AnswerB}</li>
                <li>C: {question.AnswerC}</li>
                <li>D: {question.AnswerD}</li>
              </ul>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500 font-medium">
                Đáp án đúng:{" "}
                <span className="text-green-600 font-bold">
                  {question.CorrectAnswer}
                </span>
              </p>
              {question.Explanation && (
                <p className="text-gray-600 mt-2">
                  <span className="font-semibold">Giải thích:</span>{" "}
                  {question.Explanation}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedQuestions;
