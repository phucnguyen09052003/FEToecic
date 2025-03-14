import React, { useState } from 'react';

const ModalQuestion = ({ visible, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState(initialData || {
        questionGroupId: '',
        partId: '',
        level: '',
        questionAudio: '',
        questionText: '',
        questionImage: '',
        answerA: '',
        answerB: '',
        answerC: '',
        answerD: '',
        correctAnswer: '',
        examQuestion: false,
        explanation: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra và thay thế các trường trống hoặc không có giá trị thành null
        const dataToSend = {
            ...formData,
            questionGroupId: formData.questionGroupId || null,
            partId: formData.partId || null,
            level: formData.level || null,
            questionAudio: formData.questionAudio || null,
            questionText: formData.questionText || null,
            questionImage: formData.questionImage || null,
            answerA: formData.answerA || null,
            answerB: formData.answerB || null,
            answerC: formData.answerC || null,
            answerD: formData.answerD || null,
            correctAnswer: formData.correctAnswer || null,
            examQuestion: formData.examQuestion || false, // Giữ nguyên giá trị false nếu không chọn
            explanation: formData.explanation || null,
        };

        onSubmit(dataToSend);
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl">
                <h2 className="text-lg font-bold mb-4">
                    {initialData ? 'Edit Question' : 'Add Question'}
                </h2>
                <form onSubmit={handleSubmit}>
                    {/* Group and Part */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            name="questionGroupId"
                            value={formData.questionGroupId}
                            onChange={handleChange}
                            placeholder="Question Group ID"
                            className="px-4 py-2 border w-full"
                        />
                        <select
                            name="partId"
                            value={formData.partId}
                            onChange={handleChange}
                            className="px-4 py-2 border w-full"
                        >
                            <option value="">Select Part</option>
                            {[...Array(7).keys()].map((i) => (
                                <option key={i} value={i + 1}>{`Part ${i + 1}`}</option>
                            ))}
                        </select>
                    </div>

                    {/* Level and Audio */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <select
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            className="px-4 py-2 border w-full"
                        >
                            <option value="">Select Level</option>
                            <option value="1">Easy</option>
                            <option value="2">Medium</option>
                            <option value="3">Hard</option>
                        </select>
                        <input
                            type="text"
                            name="questionAudio"
                            value={formData.questionAudio}
                            onChange={handleChange}
                            placeholder="Question Audio (URL)"
                            className="px-4 py-2 border w-full"
                        />
                    </div>

                    {/* Question Text */}
                    <textarea
                        name="questionText"
                        value={formData.questionText}
                        onChange={handleChange}
                        placeholder="Question Text"
                        className="block w-full px-4 py-2 mb-4 border"
                        rows="3"
                        required
                    />

                    {/* Question Image */}
                    <input
                        type="text"
                        name="questionImage"
                        value={formData.questionImage}
                        onChange={handleChange}
                        placeholder="Question Image (URL)"
                        className="block w-full px-4 py-2 mb-4 border"
                    />

                    {/* Answers */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            name="answerA"
                            value={formData.answerA}
                            onChange={handleChange}
                            placeholder="Answer A"
                            className="px-4 py-2 border w-full"
                            required
                        />
                        <input
                            type="text"
                            name="answerB"
                            value={formData.answerB}
                            onChange={handleChange}
                            placeholder="Answer B"
                            className="px-4 py-2 border w-full"
                            required
                        />
                        <input
                            type="text"
                            name="answerC"
                            value={formData.answerC}
                            onChange={handleChange}
                            placeholder="Answer C"
                            className="px-4 py-2 border w-full"
                            required
                        />
                        <input
                            type="text"
                            name="answerD"
                            value={formData.answerD}
                            onChange={handleChange}
                            placeholder="Answer D"
                            className="px-4 py-2 border w-full"
                            required
                        />
                    </div>

                    {/* Correct Answer */}
                    <select
                        name="correctAnswer"
                        value={formData.correctAnswer}
                        onChange={handleChange}
                        className="block w-full px-4 py-2 mb-4 border"
                        required
                    >
                        <option value="">Select Correct Answer</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>

                    {/* Exam Question and Explanation */}
                    <label className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            name="examQuestion"
                            checked={formData.examQuestion}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        Is Exam Question
                    </label>
                    <textarea
                        name="explanation"
                        value={formData.explanation}
                        onChange={handleChange}
                        placeholder="Explanation"
                        className="block w-full px-4 py-2 mb-4 border"
                        rows="3"
                    />

                    {/* Buttons */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            {initialData ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalQuestion;
