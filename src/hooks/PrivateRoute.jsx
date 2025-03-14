import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';
import LoginPromptModal from './LoginPromptModal';

const PrivateRoute = ({ element }) => {
    const { user } = useUser();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!user) {
            setShowModal(true);
        }
    }, [user]);

    const handleLogin = () => {
        setShowModal(false);
        // Chuyển hướng đến trang đăng nhập
        window.location.href = '/login';
    };

    if (user) {
        return element;
    }

    return (
        <>
            {showModal && (
                <LoginPromptModal
                    onClose={() => setShowModal(false)}
                    onLogin={handleLogin}
                />
            )}
        </>
    );
};

export default PrivateRoute;