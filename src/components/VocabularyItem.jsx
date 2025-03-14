import React, { useState, useRef } from 'react';
import axios from 'axios';

const VocabularyItem = (props) => {
  const [vocabulary, setVocabulary] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef(null); // Dùng useRef để tham chiếu đến phần tử audio

  const handleClick = () => {
    // Khi click, kiểm tra xem đã có dữ liệu hay chưa
    if (!isOpen && !vocabulary) {
      axios.get('https://api.dictionaryapi.dev/api/v2/entries/en/' + props.word)
        .then((response) => {
          const data = response.data[0];
          const wordData = {
            word: data.word,
            phonetic: data.phonetic,
            pronunciationAudio: data.phonetics.find(phonetic => phonetic.audio)?.audio || '',
            partOfSpeech: data.meanings[0].partOfSpeech,
            definition: data.meanings[0].definitions[0].definition,
            example: data.meanings[0].definitions[0].example,
          };
          setVocabulary(wordData);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }

    setIsOpen(!isOpen);
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play(); // Phát âm thanh khi click vào biểu tượng loa
    }
  };

  return (
    <div>
      <div className='flex items-center justify-between px-2 py-1 cursor-pointer bg-blue3 rounded-xl hover:font-bold' onClick={handleClick}>
        <h1 className='text-center text-white' >{props.word}</h1>
        <i class="fa-regular fa-star"></i>
      </div>
      <div className={`overflow-auto transition-all duration-300 bg-blue5  ${isOpen ? 'h-40' : 'h-0'}`}>
        {vocabulary && (
          <div className='p-3'>
            <div className='flex justify-start space-x-5'>
              <p> {vocabulary.partOfSpeech}</p>
              <p> {vocabulary.phonetic}</p>
              {vocabulary.pronunciationAudio && (
                <span className='ml-4'>
                  <span onClick={playAudio}>
                    <i class="fa-solid fa-volume-high cursor-pointer"></i>
                  </span>

                  <audio ref={audioRef} src={vocabulary.pronunciationAudio} />
                </span>
              )}

            </div>
            <p><strong>Defination:</strong> {vocabulary.definition}</p>
            {vocabulary.example && <p><strong>Example:</strong> {vocabulary.example}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyItem;
