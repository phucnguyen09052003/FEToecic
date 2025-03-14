import React from 'react';
import ImageCard from '../../../components/Card/ImageCard';
const MainSection = () => {
  return (
    <section className="py-16" id="skills">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-8">Các Mục Chính</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <a href='#/listening'> <ImageCard
            img={"https://nn.ntt.edu.vn/wp-content/uploads/2023/08/Listening-500x303.jpeg"}
            title={"Kỹ năng Nghe"}
            description={"Luyện tập kỹ năng nghe      với các đoạn hội thoại."} /></a>
          <a href='#/reading'> <ImageCard
            img={"https://mylearningspringboard.com/wp-content/uploads/2012/02/Young-Boy-Reading-in-the-Library.jpg"}
            title={"Kỹ năng đọc"}
            description={"Luyện tập kỹ năng đọc TOEIC với các đoạn văn."} /></a>
          <a href='#/exam'> <ImageCard
            img={"https://www.thoughtco.com/thmb/tVaPl-XUEXp32eYG9Ql50vYah7Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-79253051-574e362c3df78ccee143a3a9.jpg"}
            title={"Thi thử TOEIC"}
            description={"Thi thử với thời gian và cấu trúc chuẩn TOEIC"} /></a>


        </div>
      </div>
    </section>
  );
};

export default MainSection;
