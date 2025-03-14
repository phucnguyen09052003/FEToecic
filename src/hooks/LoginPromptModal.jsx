import React from 'react';

const LoginPromptModal = ({ onClose, onLogin }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-lg font-semibold mb-4">Bạn phải đăng nhập để sử dụng chức năng này</h2>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onLogin}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Đăng nhập
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPromptModal;