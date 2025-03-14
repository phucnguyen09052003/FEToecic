import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../components/header';

const VocabularyPage = () => {
    const [topics, setTopics] = useState([]);
    const [vocabulary, setVocabulary] = useState([]);
    const [selectedWord, setSelectedWord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedTopic, setSelectedTopic] = useState(''); // Thêm state để lưu Topic đã chọn
    const itemsPerPage = 15;

    useEffect(() => {
        const fetchVocabulary = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/vocabulary');
                setVocabulary(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        const fetchTopics = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/topic');
                setTopics(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVocabulary();
        fetchTopics();
    }, []);

    const handleShowInfo = async (word) => {
        // Đặt cấu trúc thông tin từ vựng
        const structuredWordInfo = {
            word: word.Word, // Lấy từ từ đối tượng từ vựng
            phonetic: word.Translation, // Lấy phần dịch nghĩa từ từ vựng
            image: word.Image, // Lấy hình ảnh từ đối tượng từ vựng
            pronunciations: [],
            meanings: []
        };
        // Gọi API từ điển để lấy thông tin phát âm và nghĩa
        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.Word}`);
            const apiData = response.data[0];

            // Cập nhật thông tin phát âm và nghĩa
            structuredWordInfo.pronunciations = apiData.phonetics.map(pronunciation => ({
                text: pronunciation.text,
                audio: pronunciation.audio
            }));
            structuredWordInfo.meanings = apiData.meanings.map(meaning => ({
                partOfSpeech: meaning.partOfSpeech,
                definitions: meaning.definitions.map(definition => ({
                    definition: definition.definition,
                    synonyms: definition.synonyms,
                    antonyms: definition.antonyms,
                    example: definition.example
                })),
            }));

            setSelectedWord(structuredWordInfo);
        } catch (error) {
            setSelectedWord(null);
        }
    };

    const handleChangePage = (page) => {
        setCurrentPage(page);
    };

    const handleTopicChange = (event) => {
        setSelectedTopic(event.target.value);
        setCurrentPage(1); // Reset trang về 1 khi đổi Topic
    };

    // Lọc từ vựng theo Topic được chọn
    const filteredVocabulary = vocabulary.filter(word =>
        selectedTopic ? word.TopicID === selectedTopic : true
    ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Tính số trang
    const totalPages = Math.ceil(vocabulary.filter(word =>
        selectedTopic ? word.TopicID === selectedTopic : true
    ).length / itemsPerPage);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex justify-between p-5 bg-gradient-to-r from-green-300 to-blue-500 rounded-lg shadow-lg h-screen overflow-hidden">
                <div className="w-72 bg-white p-5 rounded-lg shadow-md overflow-y-auto mr-5">
                    <h3 className="text-2xl font-bold text-blue-800 mb-5 text-center uppercase">Từ Vựng</h3>

                    {/* Dropdown chọn Topic */}
                    <select
                        value={selectedTopic}
                        onChange={handleTopicChange}
                        className="w-full p-2 mb-5 border rounded"
                    >
                        <option value="">Tất cả Chủ Đề</option>
                        {topics.map(topic => (
                            <option key={topic.TopicID} value={topic.TopicID}>{topic.Name}</option>
                        ))}
                    </select>

                    {loading && <p>Đang tải...</p>}
                    {error && <p>Lỗi: {error}</p>}
                    <ul className="list-none">
                        {filteredVocabulary.map(word => (
                            <li
                                key={word.id}
                                onClick={() => handleShowInfo(word)}
                                className={`cursor-pointer p-3 transition-all duration-300 rounded-lg ${selectedWord && selectedWord.word === word.Word ? 'bg-teal-200 font-bold' : 'hover:bg-gray-200'}`}
                            >
                                {word.Word}
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 flex items-center justify-center w-auto">
                        <button
                            onClick={() => handleChangePage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="mx-1 bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 transition-all duration-300"
                        >
                            &lt;&lt;
                        </button>
                        <button
                            onClick={() => handleChangePage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="mx-1 bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 transition-all duration-300"
                        >
                            &lt;
                        </button>
                        <span className="flex items-center px-4 whitespace-nowrap">
                            {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={() => handleChangePage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="mx-1 bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 transition-all duration-300"
                        >
                            &gt;
                        </button>
                        <button
                            onClick={() => handleChangePage(totalPages)}
                            disabled={currentPage === totalPages}
                            className="mx-1 bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 transition-all duration-300"
                        >
                            &gt;&gt;
                        </button>
                    </div>
                </div>

                <div className="flex-grow bg-white p-5 rounded-lg shadow-md overflow-y-auto w-7" id="word-info">
                    {selectedWord ? (
                        <div className="flex flex-col gap-5">
                            <h3 className="text-2xl font-bold text-blue-800 mb-5">{selectedWord.word}</h3>
                            <div className="flex items-start mb-5">
                                {/* Hàng hiển thị Dịch nghĩa và Phát âm */}
                                <div className="flex-grow mr-4">
                                    {/* Dịch nghĩa */}
                                    <p className="bg-gray-100 text-lg font-semibold rounded-lg p-4 shadow-md mb-3">Phiên dịch: {selectedWord.phonetic}</p>

                                    {/* Phần Phát âm */}
                                    <div className="bg-gray-100 rounded-lg p-4 shadow-md mb-3">
                                        {selectedWord.pronunciations && selectedWord.pronunciations.map((phonetic, index) => (
                                            <div key={index} className="flex items-center mb-2">
                                                <p><strong>Phát âm:</strong> {phonetic.text}</p>
                                                {phonetic.audio && (
                                                    <audio controls src={phonetic.audio} className="ml-2"></audio>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Hình ảnh từ vựng */}
                                {selectedWord.image && (
                                    <img src={selectedWord.image} alt={selectedWord.word} className="w-1/4 rounded-lg shadow-md h-full object-contain" />
                                )}
                            </div>

                            {/* Phần Nghĩa */}
                            {selectedWord.meanings && selectedWord.meanings.map((meaning, index) => (
                                <div key={index} className="bg-gray-100 rounded-lg p-4 shadow-md mb-3">
                                    <p><strong>Loại từ:</strong> {meaning.partOfSpeech}</p>
                                    <p><strong>Định nghĩa:</strong></p>
                                    <ul>
                                        {meaning.definitions.map((def, i) => (
                                            <li key={i} className="mt-1">
                                                {def.definition}
                                                {def.example && <div><strong>Ví dụ:</strong> {def.example}</div>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Chọn một từ để xem thông tin</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VocabularyPage;