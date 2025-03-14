import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Question from '../components/Question'; 
import axios from 'axios';

function QuestionPart() {
  const { part } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isSelected,setIsSelected] = useState(false);
  const [content, setContent] = useState("");
  const [correctCount, setCorrectCount] = useState(0); // Đếm số câu trả lời đúng
  const [totalCount, setTotalCount] = useState(0); // Đếm số câu hỏi đã làm

  const fetchQuestions = async () => {
    const partNumber = Number(part);
    if (partNumber) {
      if (partNumber === 6) {
        try {
          
          const response = await axios.get(`http://localhost:3000/api/random-group/${partNumber}`);
          if (response.data.length > 0) {
            setContent(response.data[0].Content);
            setQuestions(response.data);
          }
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      } else if (partNumber === 5) {
        try {
        
            const response = await axios.get(`http://localhost:3000/api/question/part/${partNumber}/random`);
            setQuestions([response.data]); // Lưu câu hỏi đơn lẻ cho part 5
            console.log(response.data[0].ExamQuestion)
           
         
        } catch (error) {
          console.error("Error fetching question:", error);
        }
     
      }
    } else {
      console.error("Part is not a valid number:", part);
    }
  };

  useEffect(() => {

    
    fetchQuestions();

  }, []);

  // Hàm cập nhật số câu trả lời đúng
  const handleAnswerUpdate = (isCorrect) => {
    setTotalCount(prevCount => prevCount + 1); // Tăng số câu hỏi đã làm
    setIsSelected(true);
    if (isCorrect) {
      setCorrectCount(prevCount => prevCount + 1); // Tăng số câu trả lời đúng
    }
  };

  const handleNext = () => {
    setIsSelected(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
    fetchQuestions();

};
const lineBreak = ({ text }) => {
  return <pre>{text}</pre>;
};
  return (
    <div className="w-auto md:w-[64rem] m-auto mt-10 flex justify-between ">
            <div className="p-5 w-52 flex justify-between shadow-xl border h-32">
            <div className='font-bold'>
            <p >Số câu hỏi:</p>
            <p>Số câu đúng: </p>
            </div>
            <div>
            <p > {totalCount}</p>
            <p className='text-green-400'> {correctCount}</p>
            </div>
    
      </div>
        <div className='w-[48rem]'>
        {part === '6' && content && (
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
         
          {content}

            
          </h2>
        </div>
      )}
    
      {part === '6' && 
        <div className='h-96 overflow-scroll py-5'>
          {
     questions.map((question, index) => (
        
      <Question onAnswerUpdate={handleAnswerUpdate}  data={question} key={index}  />
    ))
          }
   
        </div>
      } 
   
 
   
      {part === '5' && questions.length > 0 && 

        <Question onAnswerUpdate={handleAnswerUpdate}  data={questions[0][0]} />
        
            
        } 
       <div className='w-full flex justify-between'>
        <button className={`bg-green-400 p-2 rounded-xl text-white ${isSelected?'block':'hidden'}`} onClick={handleNext}>Câu tiếp theo</button>
       </div>
        </div>
  
    </div>
  );
}

export default QuestionPart;
