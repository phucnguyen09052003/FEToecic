import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SubmitPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return <p>Không có dữ liệu bài thi. Điều hướng về trang chính...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-green-600">Kết quả bài thi</h2>
        <p className="mt-4">Điểm số: <b>{result.score}</b></p>
        <p>Số câu đúng: <b>{result.totalCorrect}/{result.totalQuestions}</b></p>
        <p>Thời gian hoàn thành: <b>{result.completionTime} phút</b></p>
        <button
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => navigate("/")}
        >
          Trở về trang chính
        </button>
      </div>
    </div>
  );
};

export default SubmitPage;
