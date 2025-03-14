import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SuccessMessage from '../../AdminArea/components/SuccessMessage'
import FailMessage from '../../AdminArea/components/FailMessage'

const Vocabulary = () => {
  const [vocabulary, setVocabulary] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [wordToDelete, setWordToDelete] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [wordInfo, setWordInfo] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editWord, setEditWord] = useState({ Word: '', Translation: '', TopicID: '' });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWord, setNewWord] = useState({ Word: '', Translation: '', TopicID: '' }); const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [failMessage, setFailMessage] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const topicsPerPage = 15;


  useEffect(() => {
    fetchVocabulary();
    fetchTopics();
  }, []);

  const fetchVocabulary = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/vocabulary');
      setVocabulary(response.data);
    } catch (err) {
      setFailMessage(err.message); // Gọi hàm xử lý lỗi
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/topic');
      setTopics(response.data);
      setTotalPages(Math.ceil(response.data.length / topicsPerPage));
    } catch (err) {
      setFailMessage(err.message); // Gọi hàm xử lý lỗi
    }
  };

  const handleDeleteClick = (word) => {
    setWordToDelete(word);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/vocabulary/${wordToDelete.WordID}`); // Giả định ID là trường trong từ vựng
      setVocabulary(vocabulary.filter((item) => item.Word !== wordToDelete.Word));
      setSuccessMessage(`Deleted successfully: "${wordToDelete.Word}"`);
      setIsDeleteModalOpen(false);
      setWordToDelete(null);
      setSuccessMessage('Xóa từ vựng thành công!');
    } catch (error) {
      setFailMessage(error.message); // Gọi hàm xử lý lỗi
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setWordToDelete(null);
  };

  const handleShowInfo = async (word) => {
    setIsInfoModalOpen(true);
    try {
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.Word}`);
      const apiData = response.data[0];

      const structuredWordInfo = {
        word: apiData.word,
        phonetic: apiData.phonetic,
        pronunciations: apiData.phonetics.map(pronunciation => ({
          text: pronunciation.text,
          audio: pronunciation.audio
        })),
        meanings: apiData.meanings.map(meaning => ({
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions.map(definition => ({
            definition: definition.definition,
            synonyms: definition.synonyms,
            antonyms: definition.antonyms,
            example: definition.example
          })),
        }))
      };

      setWordInfo(structuredWordInfo);
    } catch (error) {
      handleError(error.message); // Gọi hàm xử lý lỗi
    }
  };

  const handleCloseInfo = () => {
    setIsInfoModalOpen(false);
    setWordInfo(null);
  };

  // Hàm mở modal thêm từ
  const handleAddClick = () => {
    setNewWord({ Word: '', Translation: '', TopicID: '' }); // Reset thông tin
    setIsAddModalOpen(true);
  };

  // Hàm mở modal chỉnh sửa từ
  const handleEditClick = (word) => {
    setEditWord(word);
    setIsEditModalOpen(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  // Hàm gửi yêu cầu thêm từ mới
  const handleAddSubmit = async () => {
    // Kiểm tra nếu newWord.Word là null hoặc chỉ chứa ký tự trắng
    if (!newWord.Word || newWord.Word.trim() === '') {
      setFailMessage('Từ không được để trống');
      return; // Ngừng thực hiện nếu điều kiện không thỏa mãn
    }

    try {
      const response = await axios.post('http://localhost:3000/api/vocabulary', newWord);
      setVocabulary([...vocabulary, response.data]);
      handleCloseModal();
      fetchVocabulary();
      setSuccessMessage(`Thêm thành công từ "${newWord.Word}"`);
    } catch (error) {
      setFailMessage(error.message); // Gọi hàm xử lý lỗi
    }
  };

  // Hàm gửi yêu cầu chỉnh sửa từ
  const handleEditSubmit = async () => {
    // Kiểm tra nếu newWord.Word là null hoặc chỉ chứa ký tự trắng
    if (!editWord.Word || editWord.Word.trim() === '') {
      setFailMessage('Từ không được để trống');
      return; // Ngừng thực hiện nếu điều kiện không thỏa mãn
    }
    try {
      await axios.put(`http://localhost:3000/api/vocabulary/${editWord.WordID}`, editWord);
      setVocabulary(vocabulary.map(item => item.Word === editWord.Word ? editWord : item));
      setSuccessMessage(`Edited successfully: "${editWord.Word}"`);
      handleCloseModal();
      fetchVocabulary();
      setSuccessMessage('Sửa từ vựng thành công!');
    } catch (error) {
      setFailMessage(error.message); // Gọi hàm xử lý lỗi
    }
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredVocabulary = selectedTopic
    ? vocabulary.filter(word => word.TopicID === selectedTopic)
    : vocabulary;

  const currentItems = filteredVocabulary.slice(indexOfFirstItem, indexOfLastItem);
  const totalPagesVocabulary = Math.ceil(filteredVocabulary.length / itemsPerPage);

  const closeSuccessMessage = () => setSuccessMessage('');
  const closeFailMessage = () => setFailMessage('');

  const handleNextPage = () => {
    if (currentPage < totalPagesVocabulary) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-5 bg-gray-100 rounded-lg">

      {/* Hiển thị thông báo thành công */}
      <SuccessMessage message={successMessage} onClose={closeSuccessMessage} />
      {/* Hiển thị thông báo thất bại */}
      <FailMessage message={failMessage} onClose={closeFailMessage} />

      <h1 className="text-center text-3xl text-blue-800 mb-5">Quản lý từ vựng</h1>

      <div className="flex justify-between mb-4">
        <select
          value={selectedTopic}
          onChange={e => setSelectedTopic(e.target.value)}
          className="border border-gray-300 p-2 w-1/4 rounded"
        >
          <option value="">Tất cả các chủ đề</option>
          {topics.map(topic => (
            <option key={topic.TopicID} value={topic.TopicID}>{topic.Name}</option>
          ))}
        </select>

        <button
          className="bg-green-500 text-white px-4 py-2 rounded w-1/6"
          onClick={handleAddClick}
        >
          Thêm từ
        </button>
      </div>
      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
        <thead>
          <tr>
            <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white">Hình ảnh</th>
            <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white">Từ</th>
            <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white">Dịch nghĩa</th>
            <th className="py-3 text-center border-b border-gray-300 bg-blue-800 text-white" style={{ width: '30%' }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((word, index) => (
            <tr key={index}>
              <td className="py-3 text-center border-b border-gray-300">
                {word.Image && <img src={word.Image} alt={word.Word} className="w-16 h-16 object-cover mx-auto" />}
              </td>
              <td className="py-3 text-center border-b border-gray-300">{word.Word}</td>
              <td className="py-3 text-center border-b border-gray-300">{word.Translation}</td>
              <td className="py-3 text-center border-b border-gray-300">
                <div className="flex justify-center space-x-2">
                  <button
                    className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                    onClick={() => handleEditClick(word)}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                    onClick={() => handleDeleteClick(word)}
                  >
                    Xóa
                  </button>
                  <button
                    className="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600"
                    onClick={() => handleShowInfo(word)}
                  >
                    Thông tin
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl mb-4">Xác nhận xóa</h2>
            <p>
              Bạn có chắc chắn muốn xóa từ
              <span className="text-red-500"> "{wordToDelete?.Word}" </span>
              ?
            </p>
            <div className="flex justify-end mt-4">
              <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded">Xóa</button>
              <button onClick={handleCancelDelete} className="p-2 bg-gray-400 text-white rounded ml-2">Hủy</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal hiển thị thông tin từ */}
      {isInfoModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3 relative max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl mb-4">Thông tin từ</h2>
              <button
                onClick={handleCloseInfo}
                className="text-gray-600 hover:text-gray-900 w-1/12"
                style={{ flex: '0 0 3%' }}
                aria-label="Close">X
              </button>
            </div>
            {wordInfo && (
              <>
                <p><strong>Từ:</strong> {wordInfo.word}</p>
                {wordInfo.pronunciations && wordInfo.pronunciations.length > 0 && wordInfo.pronunciations.map((phonetic, index) => (
                  <div key={index}>
                    <p><strong>Phát âm:</strong> {phonetic.text}</p>
                    {phonetic.audio && <audio controls src={phonetic.audio}></audio>}
                  </div>
                ))}
                {wordInfo.meanings && wordInfo.meanings.map((meaning, index) => (
                  <div key={index}>
                    <p><strong>Loại từ:</strong> {meaning.partOfSpeech}</p>
                    <p><strong>Định nghĩa:</strong></p>
                    <ul>
                      {meaning.definitions.map((def, i) => (
                        <li key={i}>
                          {def.definition} {def.example && (
                            <div style={{ marginTop: '5px' }}>
                              <strong>Ví dụ:</strong>
                              <ul style={{ listStyleType: 'disc', marginLeft: '20px' }}>
                                <li>{def.example}</li>
                              </ul>
                            </div>
                          )}
                          {def.synonyms.length > 0 && (
                            <div className="mt-2">
                              <strong style={{ color: 'blue' }}>Từ đồng nghĩa:</strong>
                              <ul>
                                {def.synonyms.map((synonym, j) => (
                                  <li key={j}>
                                    <span role="img" aria-label="synonym">🔗</span> {synonym}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {def.antonyms.length > 0 && (
                            <div className="mt-2">
                              <strong style={{ color: 'red' }}>Từ trái nghĩa:</strong>
                              <ul>
                                {def.antonyms.map((antonym, j) => (
                                  <li key={j}>
                                    <span role="img" aria-label="antonym">❌</span> {antonym}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {wordInfo.otherInfo && (
                  <div>
                    <strong>Thông tin khác:</strong>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-xl mb-4">{isAddModalOpen ? 'Thêm từ mới' : 'Chỉnh sửa từ'}</h2>
            <input
              type="text"
              name="Word"
              value={isAddModalOpen ? newWord.Word : editWord.Word}
              onChange={(e) => {
                if (isAddModalOpen) {
                  setNewWord({ ...newWord, Word: e.target.value });
                } else {
                  setEditWord({ ...editWord, Word: e.target.value });
                }
              }}
              placeholder="Từ"
              className="border border-gray-300 p-2 rounded w-full mb-3"
            />
            <input
              type="text"
              name="Translation"
              value={isAddModalOpen ? newWord.Translation : editWord.Translation}
              onChange={(e) => {
                if (isAddModalOpen) {
                  setNewWord({ ...newWord, Translation: e.target.value });
                } else {
                  setEditWord({ ...editWord, Translation: e.target.value });
                }
              }}
              placeholder="Dịch nghĩa"
              className="border border-gray-300 p-2 rounded w-full mb-3"
            />
            <input
              type="text"
              name="Image"
              value={isAddModalOpen ? newWord.Image : editWord.Image}
              onChange={(e) => {
                if (isAddModalOpen) {
                  setNewWord({ ...newWord, Image: e.target.value });
                } else {
                  setEditWord({ ...editWord, Image: e.target.value });
                }
              }}
              placeholder="URL hình ảnh"
              className="border border-gray-300 p-2 rounded w-full mb-3"
            />
            <select
              name="TopicID"
              value={isAddModalOpen ? newWord.TopicID : editWord.TopicID}
              onChange={(e) => {
                if (isAddModalOpen) {
                  setNewWord({ ...newWord, TopicID: e.target.value });
                } else {
                  setEditWord({ ...editWord, TopicID: e.target.value });
                }
              }}
              className="border border-gray-300 p-2 rounded w-full mb-4"
            >
              <option value="">Chọn chủ đề</option>
              {topics.map((topic) => (
                <option key={topic.TopicID} value={topic.TopicID}>
                  {topic.Name}
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button onClick={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="p-2 bg-blue-500 text-white rounded">
                {isAddModalOpen ? 'Thêm' : 'Lưu'}
              </button>
              <button onClick={handleCloseModal} className="p-2 bg-gray-400 text-white rounded ml-2">Hủy</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-4 w-1/2 mx-auto">
        <button
          className={`p-2 bg-blue-800 text-white rounded-l-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} mx-2`}
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          Đầu
        </button>
        <button
          className={`p-2 bg-blue-800 text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''} mx-2`}
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        <span className="flex items-center px-4 whitespace-nowrap">
          Trang {currentPage} / {totalPagesVocabulary}
        </span>
        <button
          className={`p-2 bg-blue-800 text-white ${currentPage === totalPagesVocabulary ? 'opacity-50 cursor-not-allowed' : ''} mx-2`}
          onClick={handleNextPage}
          disabled={currentPage === totalPagesVocabulary}
        >
          Tiếp
        </button>
        <button
          className={`p-2 bg-blue-800 text-white rounded-r-lg ${currentPage === totalPagesVocabulary ? 'opacity-50 cursor-not-allowed' : ''} mx-2`}
          onClick={() => setCurrentPage(totalPagesVocabulary)}
          disabled={currentPage === totalPagesVocabulary}
        >
          Cuối
        </button>
      </div>
    </div>
  );
};

export default Vocabulary;