import React from 'react';
import FaFileTextO from 'react-icons/lib/fa/file-text-o';
import FaBuildingO from 'react-icons/lib/fa/building-o';
import FaCommentingO from 'react-icons/lib/fa/commenting-o';
import { CHART_TYPE } from '../constants';

const WritingView = ({ writingSpec, onCategorySelect }) => {
    return (
        <div>
            <hr />
            <div
                className='student-detail-header selectable'
                onClick={() => onCategorySelect(CHART_TYPE.TOPIC, writingSpec.storyTopic)}>
                <FaCommentingO size={32} />
                <span>{writingSpec.storyTopic}</span>
            </div>
            <div
                className='student-detail-header selectable'
                onClick={() => onCategorySelect(CHART_TYPE.CONTEXT, writingSpec.storyContext)}>
                <FaBuildingO size={32} />
                <span>{writingSpec.storyContext}</span>
            </div>
            <div className='attendance-view student-detail-header'>
                <FaFileTextO size={32} />
                <span>Writing:</span>
                <div className='writing-body'>
                    {writingSpec.storyText}
                </div>
            </div>
        </div>
    );
};

export default WritingView;