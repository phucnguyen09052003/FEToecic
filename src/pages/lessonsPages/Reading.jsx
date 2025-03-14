import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Reading() {
  const [openPart, setOpenPart] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState('');
  const [lessonContent, setLessonContent] = useState({});
  const [currentPart, setCurrentPart] = useState('');
  const [lessons, setLessons] = useState({});
  const [parts, setParts] = useState([]);
  const [currentMediaURL, setCurrentMediaURL] = useState('');
  const [selectedScore, setSelectedScore] = useState('');

  const fetchLessons = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/lessons');
      const formattedLessons = response.data.reduce((acc, lesson) => {
        const partKey = lesson.PartID;
        if (!acc[partKey]) {
          acc[partKey] = [];
        }
        acc[partKey].push({
          title: lesson.Title,
          content: {
            questionType: lesson.QuestionType,
            guide: lesson.Guide.split('\n'),
          },
          score: lesson.Score,
          partID: lesson.PartID,
        });
        return acc;
      }, {});
      setLessons(formattedLessons);
    } catch (error) {
      console.error('Error fetching lessons:', error.message);
    }
  };

  const fetchParts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/parts');
      setParts(response.data);
    } catch (error) {
      console.error('Error fetching parts:', error.message);
    }
  };

  useEffect(() => {
    fetchLessons();
    fetchParts();
  }, []); const togglePart = (partID) => {
    setOpenPart(openPart === partID ? null : partID);
    setCurrentPart(`part${partID}`);
    // Reset selected lesson and media URL when part changes
    setSelectedLesson('');
    setCurrentMediaURL('');
  };

  const handleScoreClick = (score) => {
    setSelectedScore(score);
    setSelectedLesson(''); // Reset lại bài học đã chọn
  };

  const handleLessonClick = (lessonName, content, partID) => {
    setSelectedLesson(lessonName);
    setLessonContent(content);
    // Lấy MediaURL từ parts dựa trên partID
    const part = parts.find(part => part.PartID === partID);
    if (part) {
      setCurrentMediaURL(part.MediaURL);
    }
    document.getElementById('lesson-content').scrollIntoView({ behavior: 'smooth' });
  };

  const getFilteredLessons = () => {
    if (!selectedScore || !currentPart) return [];
    const partID = parseInt(currentPart.replace('part', ''));
    return Object.values(lessons).flat().filter(lesson =>
      lesson.score === selectedScore && lesson.partID === partID
    );
  };

  return (
    <div className="flex justify-between p-5 bg-gradient-to-r from-green-300 to-blue-500 rounded-lg shadow-lg h-screen overflow-hidden">
      <div className="w-72 bg-white p-5 rounded-lg shadow-md overflow-y-auto mr-5">
        <h3 className="text-2xl font-bold text-blue-800 mb-5 text-center uppercase">Lessons</h3>
        {parts.slice(4, 7).map((part) => (
          <div key={part.PartID}>
            <button
              onClick={() => togglePart(part.PartID)}
              className={`w-full py-3 bg-gray-100 text-left text-lg font-bold rounded-lg mb-2 transition-all duration-300 ${openPart === part.PartID ? 'bg-teal-200 transform scale-105' : ''}`}
            >
              {part.Title}
            </button>
            {openPart === part.PartID && (
              <div>
                {['0 - 250', '255 - 500', '501 - 700', '701 - 900', '901 - 990'].map(score => (
                  <div
                    key={score}
                    onClick={() => handleScoreClick(score)}
                    className={`bg-white rounded-lg shadow-md p-5 mb-3 cursor-pointer transition-all duration-300 ${selectedScore === score ? 'bg-gray-200' : ''}`}
                  >
                    <h4 className="text-lg">{score}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex-grow bg-white p-5 rounded-lg shadow-md overflow-y-auto w-7" id="lesson-content">
        {/* Hiển thị nội dung bài học */}
        {selectedLesson ? (
          <div className="flex flex-col gap-5">
            <h3 className="text-2xl font-bold text-blue-800 mb-5">{selectedLesson}</h3>

            {/* Video Content */}
            {currentMediaURL && (
              <div className="flex justify-center mb-5">
                <iframe
                  className="w-1/2 h-96 rounded-lg shadow-md" // Thay đổi h-96 thành h-128
                  src={currentMediaURL.replace("youtu.be/", "youtube.com/embed/")}
                  title="YouTube video player"
                  allowFullScreen
                />
              </div>
            )}

            {/* Question Type Section */}
            <div className="bg-gray-100 rounded-lg p-4 shadow-md">
              <h4 className="text-xl font-semibold text-blue-800 mb-2">1. Question type</h4>
              <p className="text-gray-700">{lessonContent.questionType}</p>
            </div>

            {/* Guide Section */}
            <div className="bg-gray-100 rounded-lg p-4 shadow-md">
              <h4 className="text-xl font-semibold text-blue-800 mb-2">2. Guide to answer</h4>
              <div className="pl-5">
                {lessonContent.guide && lessonContent.guide.map((item, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-gray-600">- {item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nút Take an Exercise */}
            <div className="text-right mt-5">
              <Link
                to={`/reading/part/${currentPart.replace('part', '')}`} // Trích xuất số từ currentPart
                className="bg-blue-800 text-white py-2 px-5 rounded-full transition-all duration-300 hover:bg-blue-700"
              >
                Take an exercise
              </Link>
            </div>
          </div>
        ) : (
          // Hiển thị danh sách bài học theo mốc điểm
          selectedScore && (
            <div className="mt-5">
              <h4 className="text-xl font-semibold text-blue-800 mb-2">Lessons with score: {selectedScore}</h4>
              {getFilteredLessons().map((lesson, index) => (
                <div
                  key={index}
                  onClick={() => handleLessonClick(lesson.title, lesson.content, lesson.partID)}
                  className={`bg-white rounded-lg shadow-md p-5 mb-3 cursor-pointer transition-all duration-300 ${selectedLesson === lesson.title ? 'bg-gray-200' : ''}`}
                >
                  <h4 className="text-lg">{lesson.title}</h4>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Reading;