import React from 'react';
import Highlighter from "react-highlight-words";
import FaFileTextO from 'react-icons/lib/fa/file-text-o';
import FaBuildingO from 'react-icons/lib/fa/building-o';
import FaCommentingO from 'react-icons/lib/fa/commenting-o';
import { CHART_TYPE } from '../constants';

function getHighlightedText(text, keywords) {
    let highlightedText = text;
    for (const keyword of keywords) {
        highlightedText = highlightedText.replace(keyword, `<b>${keyword}</b>`)
    }

    return highlightedText;
}

const WritingView = ({ writingSpec, onCategorySelect }) => {
    console.log(writingSpec)
    return (
        <div>
            <hr />
            <div
                className='student-detail-header selectable'
                onClick={() => onCategorySelect(CHART_TYPE.TOPIC, writingSpec.topic)}>
                <FaCommentingO size={32} />
                <span>{writingSpec.topic}</span>
            </div>
            <div
                className='student-detail-header selectable'
                onClick={() => onCategorySelect(CHART_TYPE.CONTEXT, writingSpec.context)}>
                <FaBuildingO size={32} />
                <span>{writingSpec.context}</span>
            </div>
            <div className='attendance-view student-detail-header'>
                <FaFileTextO size={32} />
                <span>Writing:</span>
                <div className='writing-body'>
                    <Highlighter
                        searchWords={writingSpec.keywords}
                        textToHighlight={writingSpec.writing} />
                </div>
            </div>
        </div>
    );
};

export default WritingView;