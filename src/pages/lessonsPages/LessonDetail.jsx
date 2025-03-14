import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/Footer';

import Writing from './Writing'; // Adjust the import path as necessary
import Speaking from './Speaking'; // Adjust the import path as necessary
import Listening from './Listening'; // Adjust the import path as necessary
import Reading from './Reading'; // Adjust the import path as necessary

const LessonDetail = () => {
    const { id } = useParams(); // Get the lesson ID from the URL

    let content;
    switch (id) {
        case 'Listening':
            content = <Listening />;
            break;
        case 'Reading':
            content = <Reading />;
            break;
        default:
            content = <div>Lesson not found!</div>; // Handle invalid cases
    }

    return (
        <div className="flex flex-col min-h-screen"> {/* Sử dụng min-h-screen */}
            <Header />
            <div className="flex-grow p-5 overflow-auto">
                {content}
            </div>
        </div>
    );
};

export default LessonDetail;