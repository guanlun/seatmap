import React from 'react';
import Highlighter from "react-highlight-words";
import FaFileTextO from 'react-icons/lib/fa/file-text-o';
import FaBuildingO from 'react-icons/lib/fa/building-o';
import FaCommentingO from 'react-icons/lib/fa/commenting-o';
import { CHART_TYPE } from '../constants';

export default class WritingView extends React.Component {
    constructor() {
        super();
        this.state = {
            showCommonKeywords: false,
            commonKeywordsContainerPosition: {},
        };
    }

    componentWillUpdate() {
        const highlightedTexts = document.querySelectorAll('mark');

        for (const word of highlightedTexts) {
            word.removeEventListener('click', this.wordClickListener.bind(this));
            word.addEventListener('click', this.wordClickListener.bind(this));
        }
    }

    wordClickListener(evt) {
        const { students, writingSpec } = this.props;
        const textEl = evt.target;
        const word = textEl.innerHTML;

        const writingBodyBB = this.refs.writingBody.getBoundingClientRect();
        const textElBB = textEl.getBoundingClientRect();

        const baseOffset = {
            x: textElBB.x - writingBodyBB.x,
            y: textElBB.y - writingBodyBB.y,
        };

        for (const student of students) {
            for (const homework of student.homeworks) {
                const writing = homework.writing;

                if (writing.indexOf(word) !== -1) {

                }
            }
        }

        this.setState({
            showCommonKeywords: true,
            commonKeywordsContainerPosition: baseOffset,
        });
    }

    render() {
        const { writingSpec, onCategorySelect } = this.props;
        const { showCommonKeywords, commonKeywordsContainerPosition } = this.state;

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
                    <div className='writing-body' ref='writingBody'>
                        <Highlighter
                            searchWords={writingSpec.keywords}
                            textToHighlight={writingSpec.writing}
                            caseSensitive={true} />
                        {showCommonKeywords ?
                            <div
                                className='common-keyword-container'
                                style={{ left: commonKeywordsContainerPosition.x, top: commonKeywordsContainerPosition.y}}>
                                common keywords
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}
