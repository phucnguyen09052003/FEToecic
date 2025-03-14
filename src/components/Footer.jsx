import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-6">
      <div className="max-w-screen-xl mx-auto text-center">
        <p>&copy; 2024 TOEIC Learning. Tất cả quyền được bảo lưu.</p>
        <div className="mt-4">
          <a href="#privacy" className="text-yellow-300 hover:underline mx-4">Chính sách bảo mật</a>
          <a href="#terms" className="text-yellow-300 hover:underline mx-4">Điều khoản sử dụng</a>
          <a href="#contact" className="text-yellow-300 hover:underline mx-4">Liên hệ</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
