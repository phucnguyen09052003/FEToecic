import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie';
import animationSuccess from './success.json';
const SuccessMessage = ({ message, onClose }) => {
    const defaultOptions = {
        loop: false,  // Không lặp lại
        autoplay: true,  // Phát ngay
        animationData: animationSuccess,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                onClose(); // Đóng thông báo sau 3 giây
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    if (!message) return null;

    return (
        <div className="fixed top-5 right-4 bg-white text-lg text-green-500 p-4 rounded shadow-lg border-green-500 border-l-4">
            <div className='flex items-center'>
            <p className='mr-2'>{message}</p>             <Lottie options={defaultOptions} height={30} width={30} />
            </div>
           
        </div>
    );
};

export default SuccessMessage;
