import React from 'react';
import FaFileTextO from 'react-icons/lib/fa/file-text-o';
import FaBuildingO from 'react-icons/lib/fa/building-o';
import FaCommentingO from 'react-icons/lib/fa/commenting-o';

const WritingView = ({ writingSpec }) => {
    return (
        <div>
            <hr />
            <div className='student-detail-header'>
                <FaCommentingO size={32} />
                <span>{writingSpec.storyTopic}</span>
            </div>
            <div className='student-detail-header'>
                <FaBuildingO size={32} />
                <span>{writingSpec.storyContext}</span>
            </div>
            <div className='attendance-view student-detail-header'>
                <FaFileTextO size={32} />
                <span>Writing:</span>
            </div>
        </div>
    );
};

export default WritingView;