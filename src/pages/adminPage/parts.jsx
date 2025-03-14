import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SuccessMessage from '../../AdminArea/components/SuccessMessage'
import FailMessage from '../../AdminArea/components/FailMessage'

const Parts = () => {
    const [parts, setParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPart, setEditingPart] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const partsPerPage = 10;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [partToDelete, setPartToDelete] = useState(null);
    const [newPart, setNewPart] = useState({ Title: '', MediaURL: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [failMessage, setFailMessage] = useState('');

    const fetchParts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/parts');
            setParts(response.data);
            setTotalPages(Math.ceil(response.data.length / partsPerPage));
            setLoading(false);
        } catch (err) {
            setFailMessage(`${err.message}`);
        }
    };

    useEffect(() => {
        fetchParts();
    }, []);

    const handleDelete = async () => {
        if (partToDelete) {
            try {
                await axios.delete(`http://localhost:3000/api/parts/${partToDelete.PartID}`);
                setParts(prevParts => prevParts.filter((part) => part.PartID !== partToDelete.PartID));
                setTimeout(() => setDeleteSuccess(''), 3000);
                setIsDeleteModalOpen(false);
                setSuccessMessage('Xóa part thành công!');
            } catch (err) {
                setFailMessage(`Lỗi khi xóa part: ${err.message}`);
            }
        }
    };

    const openDeleteModal = (part) => {
        setPartToDelete(part);
        setIsDeleteModalOpen(true);
    };

    const handleUpdatePart = async () => {
        // Kiểm tra nếu editingPart.Title là null hoặc chỉ chứa khoảng trắng
        if (!editingPart.Title || editingPart.Title.trim() === '') {
            setFailMessage('Tiêu đề không được để trống');
            return; // Ngừng thực hiện nếu điều kiện không thỏa mãn
        }

        try {
            const response = await axios.put(`http://localhost:3000/api/parts/${editingPart.PartID}`, editingPart);
            setParts(parts.map(part => part.PartID === editingPart.PartID ? response.data : part));
            setEditingPart(null);
            fetchParts();
            setSuccessMessage('Cập nhật part thành công!');
        } catch (err) {
            setFailMessage(`Lỗi khi cập nhật part: ${err.message}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingPart) {
            setEditingPart({ ...editingPart, [name]: value });
        } else {
            setNewPart({ ...newPart, [name]: value });
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
        setNewPart({ Title: '', MediaURL: '' });
    };

    const handleAddPart = async () => {
        // Kiểm tra nếu newPart.Title là null hoặc chỉ chứa khoảng trắng
        if (!newPart.Title || newPart.Title.trim() === '') {
            setFailMessage('Tiêu đề không được để trống');
            return; // Ngừng thực hiện nếu điều kiện không thỏa mãn
        }

        try {
            const response = await axios.post('http://localhost:3000/api/parts', newPart);
            setParts([...parts, response.data]);
            setIsAddModalOpen(false);
            setNewPart({ Title: '', MediaURL: '' });
            fetchParts();
            setSuccessMessage('Thêm part thành công!');
        } catch (err) {
            setFailMessage(`Lỗi khi thêm part: ${err.message}`);
        }
    };

    const openEditModal = (part) => {
        setEditingPart(part);
    };

    const closeSuccessMessage = () => setSuccessMessage('');
    const closeFailMessage = () => setFailMessage('');

    const currentParts = parts.slice((currentPage - 1) * partsPerPage, currentPage * partsPerPage);

    if (loading) return <p className="text-center text-lg text-blue-800 py-12">Đang tải phần...</p>;

    return (
        <div className="p-6 bg-gray-100 rounded-lg ">
            {/* Hiển thị thông báo thành công */}
            <SuccessMessage message={successMessage} onClose={closeSuccessMessage} />
            {/* Hiển thị thông báo thất bại */}
            <FailMessage message={failMessage} onClose={closeFailMessage} />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl text-blue-800">Quản Lý Part</h1>
                <button className="w-[10%] p-2 bg-blue-800 text-white rounded ml-auto" onClick={openAddModal}>Thêm Part</button>
            </div>

            {/* Modal Thêm Part */}
            {isAddModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md w-1/2">
                        <h2 className="text-xl mb-4">Thêm Part Mới</h2>
                        <div className="mb-4">
                            <label className="block mb-1 text-left">Tiêu Đề</label>
                            <input
                                type="text"
                                name="Title"
                                placeholder="Tiêu Đề Part"
                                value={newPart.Title}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-left">URL Media</label>
                            <input
                                type="text"
                                name="MediaURL"
                                placeholder="URL Media"
                                value={newPart.MediaURL}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded w-full"
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <button onClick={handleAddPart} className="p-2 bg-blue-800 text-white rounded">Thêm Part</button>
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
                            Bạn có chắc chắn muốn xóa part
                            <span className="text-red-500"> "{partToDelete?.Title}" </span>
                            không?
                        </p>
                        <div className="flex justify-end mt-4">
                            <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded">Xóa</button>
                            <button onClick={() => setIsDeleteModalOpen(false)} className="p-2 bg-gray-400 text-white rounded ml-2">Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Sửa Part */}
            {editingPart && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md w-1/2">
                        <h2 className="text-xl mb-4">Sửa Part</h2>
                        <div className="mb-4">
                            <label className="block mb-1 text-left">Tiêu Đề</label>
                            <input
                                type="text"
                                name="Title"
                                value={editingPart.Title}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-1 text-left">URL Media</label>
                            <input
                                type="text"
                                name="MediaURL"
                                value={editingPart.MediaURL}
                                onChange={handleInputChange}
                                className="p-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button onClick={handleUpdatePart} className="p-2 bg-blue-800 text-white rounded">Cập Nhật Part</button>
                            <button onClick={() => setEditingPart(null)} className="p-2 bg-gray-400 text-white rounded ml-2">Hủy</button>
                        </div>
                    </div>
                </div>
            )}

            <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-md">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-3 text-center bg-blue-800 text-white">Tiêu Đề</th>
                        <th className="border border-gray-300 p-3 text-center bg-blue-800 text-white">URL Media</th>
                        <th className="border border-gray-300 p-3 text-center bg-blue-800 text-white">Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentParts.map((part) => (
                        <tr key={part.PartID}>
                            <td className="border border-gray-300 p-3 text-center">{part.Title}</td>
                            <td className="border border-gray-300 p-3 text-center">{part.MediaURL}</td>
                            <td className="border border-gray-300 p-3 text-center">
                                <div className="flex justify-center">
                                    <button onClick={() => openEditModal(part)} className="p-1 bg-green-500 text-white rounded">Sửa</button>
                                    <button onClick={() => openDeleteModal(part)} className="p-1 bg-red-500 text-white rounded ml-2">Xóa</button>
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

export default Parts;