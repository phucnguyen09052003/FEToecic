import React, { useState } from "react";
import AddQuestionsForm from "../components/AddQuestionForm";
const ExamControl = () => {
  const [examID, setExamID] = useState(""); // Thêm state cho ExamID
  const [examName, setExamName] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [examDuration, setExamDuration] = useState("");
  const [allQuestions, setAllQuestions] = useState([]); // Mảng lưu toàn bộ câu hỏi
  const [openParts, setOpenParts] = useState({}); // Trạng thái mở/đóng cho từng Part
  const [openGroups, setOpenGroups] = useState({}); // Trạng thái mở/đóng cho từng QuestionGroupID

  const handleAddQuestions = ({ part, level, quantity }) => {
    let apiUrl = "";

    if ([3,4, 6, 7].includes(part)) {
      apiUrl = `http://localhost:3000/api/questions/group/?n=${quantity}&part=${part}&level=${level}`;
    } else {
      apiUrl = `http://localhost:3000/api/questions/random?part=${part}&level=${level}&examQuestion=1&n=${quantity}`;
    }

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setAllQuestions((prev) => [...prev, ...data]);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  };

  const handleAddExam = (e) => {
    e.preventDefault();

    // Tạo đối tượng exam
    const examData = { examID, examName, examDescription, examDuration, allQuestions };

    // Gọi API để tạo đề thi
    fetch("http://localhost:3000/api/exams/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        examId: examID,
        examName: examName,
        examDescription: examDescription,
        durationInMinutes: examDuration,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Exam created successfully!") {
          // Sau khi tạo đề thi thành công, thêm câu hỏi vào đề thi
          addQuestionsToExam();
        }
      })
      .catch((error) => {
        console.error("Error adding exam:", error);
      });
  };

  // Hàm xử lý thêm câu hỏi vào đề thi
  const addQuestionsToExam = async () => {
    try {
      for (let question of allQuestions) {
        const response = await fetch("http://localhost:3000/api/exams/add-questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            examId: examID,
            questionId: question.QuestionID,
          }),
        });
        const data = await response.json();
        if (data.message === "Question added to exam successfully!") {
          console.log("Question added to exam:", question.QuestionID);
        } else {
          console.error("Error adding question:", question.QuestionID);
        }
      }

      // Hiển thị thông báo thành công và reset các trường
      alert("Thêm đề thi thành công");
      // Làm sạch các ô input
      setExamID('');
      setExamName('');
      setExamDescription('');
      setExamDuration('');
      setAllQuestions([]);

    } catch (error) {
      console.error("Error adding questions:", error);
    }
  };

  const handleDeleteQuestion = (questionId) => {
    setAllQuestions((prev) => prev.filter((question) => question.QuestionID !== questionId));
  };

  const handleDeleteGroup = (groupId) => {
    setAllQuestions((prev) => prev.filter((q) => q.QuestionGroupID !== groupId));
  };

  // Hàm xử lý mở/đóng danh sách câu hỏi của từng Part
  const togglePart = (part) => {
    setOpenParts((prev) => ({
      ...prev,
      [part]: !prev[part],
    }));
  };

  // Hàm xử lý mở/đóng nhóm câu hỏi theo QuestionGroupID
  const toggleGroup = (groupId) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Nhóm câu hỏi theo Part
  const groupedQuestions = allQuestions.reduce((groups, question) => {
    const part = question.PartID;
    if (!groups[part]) {
      groups[part] = [];
    }
    groups[part].push(question);
    return groups;
  }, {});

  return (

    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Thêm Đề Thi</h1>

      <div className="flex gap-8">
        {/* Form Thêm Đề Thi (Bên trái) */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <h2 className="text-2xl font-bold mb-4 text-left">Thêm Đề Thi</h2>
          <form onSubmit={handleAddExam} className="space-y-4">
            {/* Trường ExamID */}
            <div>
              <label className="block font-medium text-gray-700 text-left">Mã Đề Thi (Exam ID)</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                value={examID}
                onChange={(e) => setExamID(e.target.value)} // Cập nhật ExamID
                required
                placeholder="Nhập mã đề thi"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 text-left">Tên Đề Thi</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                required
                placeholder="Nhập tên đề thi"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 text-left">Mô Tả Đề Thi</label>
              <textarea
                className="w-full px-4 py-2 border rounded-lg"
                value={examDescription}
                onChange={(e) => setExamDescription(e.target.value)}
                required
                placeholder="Nhập mô tả đề thi"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 text-left">Thời Gian Làm Bài (Phút)</label>
              <input
                type="number"
                className="w-full px-4 py-2 border rounded-lg"
                value={examDuration}
                onChange={(e) => setExamDuration(e.target.value)}
                required
                placeholder="Nhập thời gian làm bài"
                min="1"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mt-4"
            >
              Thêm Đề Thi
            </button>
          </form>

        </div>

        {/* Form Thêm Câu Hỏi (Bên phải) */}
        <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
          <AddQuestionsForm handleAddQuestions={handleAddQuestions} />
        </div>
      </div>

      {/* Hiển thị tổng số câu hỏi */}
      <div className="mt-8 mb-4 text-lg font-medium">
        Tổng số câu hỏi: {allQuestions.length}
      </div>

      {/* Hiển thị danh sách câu hỏi theo Part */}
      <div>
        {Object.entries(groupedQuestions).map(([part, questions]) => (
          <div key={part} className="mb-6">
            {/* Header của Part */}
            <div
              onClick={() => togglePart(part)}
              className="cursor-pointer bg-gray-200 p-4 rounded-lg flex justify-between items-center"
            >
              <h3 className="text-xl text-left font-semibold">Phần {part}</h3>
              <span className="text-sm">Số câu hỏi: {questions.length}</span>
              <span>{openParts[part] ? "▲" : "▼"}</span>
            </div>

            {/* Hiển thị câu hỏi nếu Part đang mở */}
            {openParts[part] && (
              <div className="mt-4">
                {([4, 6, 7].includes(Number(part))
                  ? Object.entries(
                    questions.reduce((groups, question) => {
                      const groupId = question.QuestionGroupID;
                      if (!groups[groupId]) {
                        groups[groupId] = [];
                      }
                      groups[groupId].push(question);
                      return groups;
                    }, {})
                  ).map(([groupId, groupQuestions]) => (
                    <div key={groupId} className="mb-4">
                      {/* Header của Group */}
                      <div
                        onClick={() => toggleGroup(groupId)}
                        className="cursor-pointer bg-gray-300 p-3 rounded-lg flex justify-between items-center"
                      >
                        <h4 className="text-lg font-medium">Nhóm {groupId}</h4>
                        <span className="text-sm">
                          Số câu hỏi trong nhóm: {groupQuestions.length}
                        </span>
                        <button
                          onClick={() => handleDeleteGroup(groupId)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          Xóa Nhóm
                        </button>
                      </div>

                      {/* Danh sách câu hỏi trong Group */}
                      {openGroups[groupId] && (
                        <div className="ml-4 mt-2 space-y-2">
                          {groupQuestions.map((question, index) => (
                            <div key={index} className="border-b pb-2">
                              <p>{question.QuestionText}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                  : questions.map((question, index) => (
                    <div
                      key={index}
                      className="border-b pb-2 flex justify-between items-center"
                    >
                      <p>{question.QuestionText}</p>
                      {!question.QuestionGroupID && (
                        <button
                          onClick={() => handleDeleteQuestion(question.QuestionID)} // Xóa câu hỏi đơn
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        >
                          Xóa
                        </button>
                      )}
                    </div>

                  )))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamControl;
