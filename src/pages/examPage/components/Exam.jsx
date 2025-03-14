import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Exam({ exam }) {
  const navigate = useNavigate();
  const [groupQuestions, setGroupQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleStartExam = () => {
    // Truyền thông tin bài thi qua state
    navigate(`/exam/${exam.ExamID}`, { state: { examData: exam } });
  };

  // Lấy tất cả câu hỏi nhóm nếu có GroupQuestionID
  useEffect(() => {
    if (exam.GroupQuestionID) {
      const fetchGroupQuestions = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:3000/api/questions/group-question/${exam.GroupQuestionID}`
          );
          const data = await response.json();
          setGroupQuestions(data.questions); // Giả sử API trả về danh sách câu hỏi
          setLoading(false);
        } catch (error) {
          console.error("Error fetching group questions:", error);
          setLoading(false);
        }
      };

      fetchGroupQuestions();
    }
  }, [exam.GroupQuestionID]);

  return (
    <div className="p-5 border rounded-lg shadow-md bg-blue-50 flex flex-col justify-between">
      <img className="p-4" src="/src/assets/testing.png" alt="Exam" />
      <h3 className="font-bold text-lg text-blue-700">{exam.ExamName}</h3>
      <p className="text-gray-700 mb-4">{exam.Description}</p>
      <p className="mb-4">
        <b>Thời gian: </b> {exam.DurationInMinutes} phút
      </p>
      <p className="mb-4">
        <b>Mô tả: </b> {exam.Description}
      </p>

      {/* Hiển thị câu hỏi nhóm nếu có */}
      {exam.GroupQuestionID && groupQuestions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-lg font-bold text-blue-600">Các câu hỏi nhóm:</h4>
          {loading ? (
            <p>Đang tải câu hỏi...</p>
          ) : (
            groupQuestions.map((question) => (
              <div key={question.id} className="mb-4 p-3 border rounded-lg">
                <p><b>Câu hỏi:</b> {question.Content}</p>
                {/* Thêm phần hiển thị đáp án hoặc các phần khác nếu cần */}
              </div>
            ))
          )}
        </div>
      )}

      {/* Button để bắt đầu bài thi */}
      <button
        className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
        onClick={handleStartExam}
      >
        Bắt đầu làm
      </button>
    </div>
  );
}

export default Exam;
