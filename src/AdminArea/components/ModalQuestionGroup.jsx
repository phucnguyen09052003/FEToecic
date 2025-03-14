import React, { useState } from 'react';
import axios from 'axios';

const ModalQuestionGroup = ({ group, onClose, setSuccessMessage, setFailMessage }) => {
  const [formData, setFormData] = useState({
    questionGroupId: group?.QuestionGroupID || '',
    audio: group?.Audio || '',
    content: group?.Content || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (group) {
        // Cập nhật
        await axios.put(`http://localhost:3000/api/questions/group/update/${group.QuestionGroupID}`, formData);
        setSuccessMessage('Cập nhật nhóm câu hỏi thành công!');
      } else {
        // Tạo mới
        await axios.post('http://localhost:3000/api/questions/group/create/', formData);
        setSuccessMessage('Thêm nhóm câu hỏi thành công!');
      }
      onClose();
    } catch (error) {
      console.error('Error saving question group:', error);
      setFailMessage('Có lỗi xảy ra khi lưu nhóm câu hỏi.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">
          {group ? 'Chỉnh sửa nhóm câu hỏi' : 'Thêm nhóm câu hỏi'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">ID Nhóm Câu Hỏi</label>
            <input
              type="text"
              name="questionGroupId"
              value={formData.questionGroupId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              disabled={!!group}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Audio</label>
            <input
              type="text"
              name="audio"
              value={formData.audio}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Nội Dung</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-400 text-white rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalQuestionGroup;