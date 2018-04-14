import React from 'react';
import Highlighter from "react-highlight-words";
import FaFileTextO from 'react-icons/lib/fa/file-text-o';
import FaBuildingO from 'react-icons/lib/fa/building-o';
import FaCommentingO from 'react-icons/lib/fa/commenting-o';
import { CHART_TYPE } from '../constants';

function getTextContext(word, text) {
    const wordStartIndex = text.indexOf(word);
    const wordEndIndex = wordStartIndex + word.length;

    let spaceCount = 0;
    let currIndex = wordStartIndex - 1;
    while (spaceCount < 3) {
        if (currIndex < 0) {
            break;
        }

        currIndex--;

        if (text.charAt(currIndex) === ' ') {
            spaceCount++;
        }
    }

    const contextStartIndex = currIndex;

    spaceCount = 0;
    currIndex = wordEndIndex + 1;
    while (spaceCount < 3) {
        if (currIndex >= text.length) {
            break;
        }

        currIndex++;

        if (text.charAt(currIndex) === ' ') {
            spaceCount++;
        }
    }

    const contextEndIndex = currIndex;

    let context = text.slice(contextStartIndex + 1, contextEndIndex);

    if (contextStartIndex >= 0) {
        context = '... ' + context;
    }

    if (contextEndIndex < text.length) {
        context += ' ...';
    }

    return context;
}

export default class WritingView extends React.Component {
    constructor() {
        super();
        this.state = {
            showCommonKeywords: false,
            commonKeywordsContainerPosition: {},
            contextTexts: [],
        };
    }

    componentDidMount() {
        const highlightedTexts = document.querySelectorAll('.writing-body > span > mark');

        for (const word of highlightedTexts) {
            word.addEventListener('click', this.wordClickListener.bind(this));
        }

        document.addEventListener('click', this.documentClickListener.bind(this));
    }

    documentClickListener(evt) {
        this.setState({
            showCommonKeywords: false,
        })
    }

    wordClickListener(evt) {
        evt.stopPropagation();
        const { students, writingSpec } = this.props;
        const textEl = evt.target;
        const word = textEl.innerHTML;

        const writingBodyBB = this.refs.writingBody.getBoundingClientRect();
        const textElBB = textEl.getBoundingClientRect();

        const baseOffset = {
            x: textElBB.x - writingBodyBB.x,
            y: textElBB.y - writingBodyBB.y,
        };

        const contextTexts = [];

        for (const student of students) {
            for (const homework of student.homeworks) {
                const writing = homework.writing;

                if (writingSpec.writing != writing && writing.indexOf(word) !== -1) {
                    contextTexts.push({
                        student,
                        word,
                        context: getTextContext(word, writing),
                    });
                }
            }
        }

        this.setState({
            showCommonKeywords: true,
            commonKeywordsContainerPosition: baseOffset,
            contextTexts,
        });
    }

    render() {
        const { writingSpec, onCategorySelect } = this.props;
        const { showCommonKeywords, commonKeywordsContainerPosition, contextTexts } = this.state;

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
                            highlightClassName='highlighted-keyword'
                            searchWords={writingSpec.keywords}
                            textToHighlight={writingSpec.writing}
                            caseSensitive={true} />
                        {showCommonKeywords ?
                            <div
                                className='common-keyword-container'
                                style={{ left: commonKeywordsContainerPosition.x, top: commonKeywordsContainerPosition.y}}>
                                {contextTexts.length === 0 ?
                                    <div className="no-common-keywords-container">No common keywords</div> :
                                    <div className='common-keyword-list'>
                                        {contextTexts.map((ct, idx) =>
                                            <div
                                                className='context-word-item'
                                                key={`context-word-item-${idx}`}
                                                onClick={() => this.handleCommonWordItemClick(ct.student)} >
                                                <div>{ct.student.name}</div>
                                                <Highlighter
                                                    highlightClassName='highlighted-keyword'
                                                    searchWords={[ct.word]}
                                                    textToHighlight={ct.context} />
                                            </div>
                                        )}
                                    </div>
                                }
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        );
    }

    handleCommonWordItemClick(student) {
        const { onCommonWordSelect } = this.props;

        this.setState({
            showCommonKeywords: false,
        });

        onCommonWordSelect(student);
    }
}
