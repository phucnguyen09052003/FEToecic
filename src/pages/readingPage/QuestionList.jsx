import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import Question from "../../components/Question"; // Import component Question

function QuestionList({ examId, onAnswerUpdate }) {
  const { data: questions, loading, error } = useFetch(
    `http://localhost:3000/api/questions/exam/${examId}`
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Trạng thái để theo dõi câu hỏi hiện tại

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;

  // Hàm xử lý chuyển đến câu hỏi trước
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Hàm xử lý chuyển đến câu hỏi tiếp theo
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Hàm xử lý khi bấm vào một câu hỏi trong danh sách
  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div className="flex">
      <div className="w-3/4">
        <h3 className="text-xl font-semibold">Danh sách câu hỏi</h3>
        <div className="space-y-4">
          {questions.length > 0 && (
            <div className="mb-4">
              {/* Chỉ hiển thị câu hỏi hiện tại */}
              <Question
                data={questions[currentQuestionIndex]}
                onAnswerUpdate={onAnswerUpdate}
              />
            </div>
          )}

          {/* Các nút điều hướng */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrevious}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
            >
              Quay lại
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
            >
              Kế tiếp
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách câu hỏi bên phải */}
      <div className="w-1/4 ml-4">
        <h3 className="text-xl font-semibold">Danh sách câu hỏi</h3>
        <ul className="space-y-2">
          {questions.map((question, index) => (
            <li
              key={question.QuestionID}
              className={`cursor-pointer ${
                index === currentQuestionIndex
                  ? "font-bold text-blue-500"
                  : "text-gray-700"
              }`}
              onClick={() => handleQuestionClick(index)}
            >
              Câu {index + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default QuestionList;
