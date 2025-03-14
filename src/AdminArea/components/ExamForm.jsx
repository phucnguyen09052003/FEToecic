import React, { useState } from "react";

const ExamForm = ({ onSubmit }) => {
  const [examId, setExamId] = useState("");
  const [examName, setExamName] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ examId, examName, duration });
    }
    setExamId("");
    setExamName("");
    setDuration("");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 uppercase">Thêm Đề Thi</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mã Đề Thi */}
        <div>
          <label className="block font-medium text-gray-700">Mã Đề Thi</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            required
            placeholder="Nhập mã đề thi"
          />
        </div>

        {/* Tên Đề Thi */}
        <div>
          <label className="block font-medium text-gray-700">Tên Đề Thi</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            required
            placeholder="Nhập tên đề thi"
          />
        </div>

        {/* Thời Gian Làm Bài */}
        <div>
          <label className="block font-medium text-gray-700">Thời Gian Làm Bài (phút)</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            placeholder="Nhập thời gian làm bài"
            min="1"
          />
        </div>

        {/* Nút Thêm */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Thêm Đề Thi
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamForm;
