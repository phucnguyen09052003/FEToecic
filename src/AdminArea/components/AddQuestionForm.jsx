import React, { useState } from "react";

const AddQuestionsForm = ({ handleAddQuestions }) => {
  const [part, setPart] = useState(1);  // Mặc định part là 1
  const [level, setLevel] = useState(1);  // Mặc định level là 1
  const [quantity, setQuantity] = useState(1);  // Mặc định số lượng là 1

  // Hàm xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi hàm handleAddQuestions từ ExamControl với part, level, quantity
    handleAddQuestions({ part, level, quantity });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Thêm Câu Hỏi</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700 text-left">Part</label>
          <select
            value={part}
            onChange={(e) => setPart(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value={1}>Part 1</option>
            <option value={2}>Part 2</option>
            <option value={3}>Part 3</option>
            <option value={4}>Part 4</option>
            <option value={5}>Part 5</option>
            <option value={6}>Part 6</option>
            <option value={7}>Part 7</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 text-left">Mức độ</label>
          <select
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value={1}>Dễ</option>
            <option value={2}>Trung Bình</option>
            <option value={3}>Khó</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 text-left">Số Lượng</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full px-4 py-2 border rounded-lg"
            min="1"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Thêm Câu Hỏi
        </button>
      </form>
    </div>
  );
};

export default AddQuestionsForm;
