import React, { useState, useEffect } from 'react';

const TableQuestions = ({ onEdit, onDelete }) => {
    const [questions, setQuestions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10; // Số câu hỏi trên mỗi trang

    useEffect(() => {
        fetchQuestions(page);
    }, [page]);

    const fetchQuestions = async (page) => {
        try {
            const response = await fetch(`http://localhost:3000/api/questions/paging?page=${page}&pageSize=${itemsPerPage}`);
            const data = await response.json();
            setQuestions(data);
            setTotalPages(Math.ceil(data.total / itemsPerPage)); // Giả định API trả `total` số câu hỏi
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) {
            await onDelete(id);
            fetchQuestions(page);
        }
    };

    return (
        <div className="max-h-full overflow-y-auto">
            <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                    <tr>
                        <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white min-w-[100px]">ID</th>
                        <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white min-w-[200px]">Nội Dung Câu Hỏi</th>
                        <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white min-w-[100px]">Mức Độ</th>
                        <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white min-w-[150px]">Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((q) => (
                        <tr key={q.QuestionID}>
                            <td className="py-3 text-center border-b border-gray-300">{q.QuestionID}</td>
                            <td className="py-3 text-center border-b border-gray-300">{q.QuestionText}</td>
                            <td className="py-3 text-center border-b border-gray-300">{q.Level}</td>
                            <td className="py-3 text-center border-b border-gray-300">
                                <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-4" onClick={() => onEdit(q)}>Sửa</button>
                                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(q.QuestionID)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center mt-4 w-1/2 mx-auto">
                <button
                    className={`p-2 bg-blue-800 text-white rounded-l-lg ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''} mx-2`}
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                >
                    Đầu
                </button>
                <button
                    className={`p-2 bg-blue-800 text-white ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''} mx-2`}
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Trước
                </button>
                <span className="flex items-center px-4 whitespace-nowrap">
                    Trang {page}
                </span>
                <button
                    className={`p-2 bg-blue-800 text-white rounded-r-lg ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''} mx-2`}
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                >
                    Tiếp
                </button>

            </div>
        </div>
    );
};

export default TableQuestions;