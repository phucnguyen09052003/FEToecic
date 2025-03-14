import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SuccessMessage from '../../AdminArea/components/SuccessMessage'
import FailMessage from '../../AdminArea/components/FailMessage'

// Trang Bài Học
const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLesson, setCurrentLesson] = useState({ Title: '', Content: '', QuestionType: '', Guide: '', Score: '', PartID: '' });
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [failMessage, setFailMessage] = useState('');
  const itemsPerPage = 4;


  const fetchLessons = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/lessons');
      setLessons(response.data);
    } catch (err) {
      setFailMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchParts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/parts');
      setParts(response.data);
    } catch (error) {
      setFailMessage(error.message);
    }
  };

  useEffect(() => {
    fetchLessons();
    fetchParts();
  }, []);

  if (loading) return <div className="text-center text-2xl text-blue-800 py-12">Đang tải bài học...</div>;
  if (error) return <div className="text-center text-2xl text-red-600 py-12">Lỗi khi tải bài học: {error}</div>;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = lessons.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(lessons.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openConfirmDeleteModal = (lesson) => {
    setLessonToDelete(lesson);
    setIsConfirmDeleteOpen(true);
  };

  const openModal = (lesson = null) => {
    if (lesson) {
      setCurrentLesson(lesson);
      setIsEditMode(true);
    } else {
      setCurrentLesson({ Title: '', Content: '', QuestionType: '', Guide: '', Score: '', PartID: '' });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const saveLesson = async () => {
    // Kiểm tra nếu Title, Content, và Guide đều không hợp lệ
    if (!currentLesson.Title || currentLesson.Title.trim() === '' ||
      !currentLesson.Content || currentLesson.Content.trim() === '' ||
      !currentLesson.Guide || currentLesson.Guide.trim() === '') {
      setFailMessage('Tiêu đề, nội dung và hướng dẫn không được để trống');
      return; // Ngừng thực hiện nếu điều kiện không thỏa mãn
    }

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:3000/api/lessons/${currentLesson.LessonID}`, currentLesson);
      } else {
        await axios.post('http://localhost:3000/api/lessons', currentLesson);
      }
      fetchLessons();
      setIsModalOpen(false);
      setSuccessMessage('Lưu bài học thành công!');
    } catch (error) {
      setFailMessage(error.message);
    }
  };

  const deleteLesson = async (lessonId) => {
    try {
      await axios.delete(`http://localhost:3000/api/lessons/${lessonId}`);
      fetchLessons();
      setSuccessMessage('Xóa bài học thành công!');
    } catch (error) {
      setFailMessage(error.message);
    }
  };

  // Danh sách tùy chọn điểm số
  const scoreOptions = [
    '0 - 250',
    '251 - 500',
    '501 - 750',
    '751 - 1000',
  ];


  const closeSuccessMessage = () => setSuccessMessage('');
  const closeFailMessage = () => setFailMessage('');

  return (
    <div className="p-5 bg-gray-100 rounded-lg max-w-full overflow-hidden relative">

      {/* Hiển thị thông báo thành công */}
      <SuccessMessage message={successMessage} onClose={closeSuccessMessage} />
      {/* Hiển thị thông báo thất bại */}
      <FailMessage message={failMessage} onClose={closeFailMessage} />

      <div className="flex justify-between items-center mb-5">
        <h1 className="text-4xl text-blue-800">Quản lý Bài Học</h1>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => openModal()}>
          Thêm Bài Học Mới
        </button>
      </div>

      <div className="max-h-full overflow-y-auto">
        <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr>
              <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white min-w-[150px]">Tiêu Đề</th>
              <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white min-w-[200px]">Nội Dung</th>
              <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white min-w-[150px]">Loại Câu Hỏi</th>
              <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white min-w-[200px]">Hướng Dẫn</th>
              <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white min-w-[100px]">Điểm</th>
              <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white min-w-[150px]">Phần</th>
              <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white min-w-[100px]">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((lesson, index) => (
              <tr key={index}>
                <td className="py-3 text-center border-b border-gray-300">{lesson.Title}</td>
                <td className="py-3 text-center border-b border-gray-300">{lesson.Content}</td>
                <td className="py-3 text-center border-b border-gray-300">{lesson.QuestionType}</td>
                <td className="py-3 text-center border-b border-gray-300">{lesson.Guide}</td>
                <td className="py-3 text-center border-b border-gray-300">{lesson.Score}</td>
                <td className="py-3 text-center border-b border-gray-300">{lesson.PartID}</td>
                <td className="py-3 text-center border-b border-gray-300">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-4 w-full mb-2" onClick={() => openModal(lesson)}>Sửa</button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded w-full" onClick={() => openConfirmDeleteModal(lesson)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 w-1/2 mx-auto">
        <button
          className={`p-2 bg-blue-800 text-white rounded-l-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} mx-2`}
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          Đầu
        </button>
        <button
          className={`p-2 bg-blue-800 text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} mx-2`}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        <span className="flex items-center px-4 whitespace-nowrap">
          Trang {currentPage} của {totalPages}
        </span>
        <button
          className={`p-2 bg-blue-800 text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''} mx-2`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Tiếp
        </button>
        <button
          className={`p-2 bg-blue-800 text-white rounded-r-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''} mx-2`}
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          Cuối
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded shadow-md w-1/3">
            <h2 className="text-xl mb-4">{isEditMode ? 'Sửa Bài Học' : 'Thêm Bài Học Mới'}</h2>
            <select
              value={currentLesson.PartID}
              onChange={e => setCurrentLesson({ ...currentLesson, PartID: e.target.value })}
              className="border border-gray-300 p-2 mb-3 w-full rounded"
            >
              <option value="">Chọn Phần</option>
              {parts.map(part => (
                <option key={part.PartID} value={part.PartID}>{part.Title}</option>
              ))}
            </select>
            <select
              value={currentLesson.Score}
              onChange={e => setCurrentLesson({ ...currentLesson, Score: e.target.value })}
              className="border border-gray-300 p-2 mb-3 w-full rounded"
            >
              <option value="">Chọn Điểm</option>
              {scoreOptions.map((score, index) => (
                <option key={index} value={score}>{score}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Tiêu Đề"
              value={currentLesson.Title}
              onChange={e => setCurrentLesson({ ...currentLesson, Title: e.target.value })}
              className="border border-gray-300 p-2 mb-3 w-full rounded"
            />
            <textarea
              placeholder="Nội Dung"
              value={currentLesson.Content}
              onChange={e => setCurrentLesson({ ...currentLesson, Content: e.target.value })}
              className="border border-gray-300 p-2 mb-3 w-full rounded h-24"
            />
            <input
              type="text"
              placeholder="Loại Câu Hỏi"
              value={currentLesson.QuestionType}
              onChange={e => setCurrentLesson({ ...currentLesson, QuestionType: e.target.value })}
              className="border border-gray-300 p-2 mb-3 w-full rounded"
            />
            <textarea
              placeholder="Hướng Dẫn"
              value={currentLesson.Guide}
              onChange={e => setCurrentLesson({ ...currentLesson, Guide: e.target.value })}
              className="border border-gray-300 p-2 mb-3 w-full rounded h-24"
            />
            <div className="flex justify-end">
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={saveLesson}>
                {isEditMode ? 'Cập Nhật' : 'Thêm'}
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded shadow-md w-1/3">
            <h2 className="text-xl mb-4">Xác Nhận Xóa</h2>
            <p>Bạn có chắc chắn muốn xóa bài học <strong >{lessonToDelete?.Title}</strong>?</p>
            <div className="flex justify-end mt-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded mr-2" onClick={() => {
                deleteLesson(lessonToDelete.LessonID);
                setIsConfirmDeleteOpen(false);
              }}>
                Xóa
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsConfirmDeleteOpen(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Lessons;