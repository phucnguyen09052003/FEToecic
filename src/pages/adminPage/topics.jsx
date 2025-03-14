import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SuccessMessage from '../../AdminArea/components/SuccessMessage'
import FailMessage from '../../AdminArea/components/FailMessage'

const Topics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTopic, setEditingTopic] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const topicsPerPage = 10;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);
  const [newTopic, setNewTopic] = useState({ Name: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [failMessage, setFailMessage] = useState('');

  const fetchTopics = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/topic');
      setTopics(response.data);
      setTotalPages(Math.ceil(response.data.length / topicsPerPage));
      setLoading(false);
    } catch (err) {
      setFailMessage(`${err.message}`);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleDelete = async () => {
    if (topicToDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/topic/${topicToDelete.TopicID}`);
        setTopics(prevTopics => prevTopics.filter((topic) => topic.TopicID !== topicToDelete.TopicID));
        setSuccessMessage('Xóa chủ đề thành công!');
      } catch (err) {
        setFailMessage(`Lỗi khi xóa chủ đề: ${err.message}`);
      }
    }
  };

  const openDeleteModal = (topic) => {
    setTopicToDelete(topic);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateTopic = async () => {
    // Kiểm tra xem editingTopic.Name có hợp lệ không
    if (!editingTopic.Name || editingTopic.Name.trim() === '') {
      setFailMessage('Tên chủ đề không được để trống.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/topic/${editingTopic.TopicID}`, editingTopic);
      setTopics(topics.map(topic => topic.TopicID === editingTopic.TopicID ? response.data : topic));
      setEditingTopic(null);
      fetchTopics();
      setSuccessMessage('Cập nhật chủ đề thành công!');
    } catch (err) {
      setFailMessage(`Lỗi khi cập nhật chủ đề: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingTopic) {
      setEditingTopic({ ...editingTopic, [name]: value });
    } else {
      setNewTopic({ ...newTopic, [name]: value });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
    const nextID = `TP${String(topics.length + 1).padStart(2, '0')}`;
    setNewTopic({ TopicID: nextID, Name: '' });
  };

  const handleAddTopic = async () => {
    // Kiểm tra xem newTopic.Name có hợp lệ không
    if (!newTopic.Name || newTopic.Name.trim() === '') {
      setFailMessage('Tên chủ đề không được để trống.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/topic', newTopic);
      setTopics([...topics, response.data]);
      setIsAddModalOpen(false);
      setNewTopic({ Name: '' });
      fetchTopics();
      setSuccessMessage('Thêm chủ đề thành công!');
    } catch (err) {
      setFailMessage(`Lỗi khi thêm chủ đề: ${err.message}`);
    }
  };

  const openEditModal = (topic) => {
    setEditingTopic(topic);
  };

  const closeSuccessMessage = () => setSuccessMessage('');
  const closeFailMessage = () => setFailMessage('');

  const currentTopics = topics.slice((currentPage - 1) * topicsPerPage, currentPage * topicsPerPage);

  if (loading) return <p className="text-center text-lg text-blue-800 py-12">Đang tải chủ đề...</p>;

  return (
    <div className="p-6 bg-gray-100 rounded-lg ">
      {/* Hiển thị thông báo thành công */}
      <SuccessMessage message={successMessage} onClose={closeSuccessMessage} />
      {/* Hiển thị thông báo thất bại */}
      <FailMessage message={failMessage} onClose={closeFailMessage} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-blue-800">Quản Lý Chủ Đề</h1>
        <button className="w-[10%] p-2 bg-blue-800 text-white rounded ml-auto" onClick={openAddModal}>Thêm Chủ Đề</button>
      </div>

      {/* Modal Thêm Chủ Đề */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/2">
            <h2 className="text-xl mb-4">Thêm Chủ Đề Mới</h2>
            <div className="mb-4">
              <label className="block mb-1 text-left">Mã Chủ Đề</label>
              <input
                type="text"
                name="TopicID"
                value={newTopic.TopicID}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-left">Tên</label>
              <input
                type="text"
                name="Name"
                placeholder="Tên Chủ Đề"
                value={newTopic.Name}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleAddTopic} className="p-2 bg-blue-800 text-white rounded">Thêm Chủ Đề</button>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-gray-400 text-white rounded ml-2">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl mb-4">Xác Nhận Xóa</h2>
            <p>
              Bạn có chắc chắn muốn xóa chủ đề
              <span className="text-red-500"> "{topicToDelete?.Name}" </span>
              không?
            </p>
            <div className="flex justify-end mt-4">
              <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded">Xóa</button>
              <button onClick={() => setIsDeleteModalOpen(false)} className="p-2 bg-gray-400 text-white rounded ml-2">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sửa Chủ Đề */}
      {editingTopic && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/2">
            <h2 className="text-xl mb-4">Sửa Chủ Đề</h2>
            <div className="mb-4">
              <label className="block mb-1 text-left">Mã Chủ Đề</label>
              <input
                type="text"
                name="TopicID"
                value={editingTopic.TopicID}
                readOnly
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-left">Tên</label>
              <input
                type="text"
                name="Name"
                value={editingTopic.Name}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded w-full"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={handleUpdateTopic} className="p-2 bg-blue-800 text-white rounded">Cập Nhật Chủ Đề</button>
              <button onClick={() => setEditingTopic(null)} className="p-2 bg-gray-400 text-white rounded ml-2">Hủy</button>
            </div>
          </div>
        </div>
      )}

      <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-md">
        <thead>
          <tr>
            <th className="border border-gray-300 p-3 text-center bg-blue-800 text-white">Mã</th>
            <th className="border border-gray-300 p-3 text-center bg-blue-800 text-white">Tên</th>
            <th className="border border-gray-300 p-3 text-center bg-blue-800 text-white">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {currentTopics.map((topic) => (
            <tr key={topic.TopicID}>
              <td className="border border-gray-300 p-3 text-center">{topic.TopicID}</td>
              <td className="border border-gray-300 p-3 text-center">{topic.Name}</td>
              <td className="border border-gray-300 p-3 text-center">
                <div className="flex justify-center">
                  <button onClick={() => openEditModal(topic)} className="p-1 bg-green-500 text-white rounded">Sửa</button>
                  <button onClick={() => openDeleteModal(topic)} className="p-1 bg-red-500 text-white rounded ml-2">Xóa</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
    </div>
  );
};

export default Topics;