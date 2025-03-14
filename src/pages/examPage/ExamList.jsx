import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Exam from './components/Exam';
import Header from '../../components/header';
import Footer from '../../components/Footer';
function ExamList() {
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedParts, setSelectedParts] = useState([]);

  // Fetch dữ liệu Exam
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/exams/');
        setExams(response.data);
        setFilteredExams(response.data);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, []);



  

  return (
   <>
   <Header/>
   <div className="max-w-7xl mx-auto p-5">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Danh sách bài thi</h1>
      
      {/* Layout 2 cột */}
      <div className="grid grid-cols-12 gap-6">

        {/* Cột phải: Danh sách Exam */}
        <div className="col-span-12 md:col-span-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam, index) => (
            <Exam key={index} exam={exam} />
          ))}
        </div>
      </div>
    </div>
    <Footer/>
   </>
  );
}

export default ExamList;
