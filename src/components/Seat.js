import React from 'react';
import { CHART_TYPE } from '../constants';

function lowerCaseStartsWith(text, segment) {
    return text.toLowerCase().indexOf(segment.toLowerCase()) === 0;
}

const Seat = ({ seatSpec, minSeatPos, seatedStudent, isSelected, onSelect, nameFilter, highlightedType, highlightedCategory, highlightColor }) => {
    const classNames = ['seat'];
    if (isSelected) {
        classNames.push('selected');
    }

    const elStyle = {
        left: seatSpec.x - minSeatPos.x + 20,
        top: seatSpec.y - minSeatPos.y + 20,
        transform: `rotate(${seatSpec.rotation}deg)`,
    };

    if (seatedStudent) {
        const { homeworks } = seatedStudent;

        const lastHomework = seatedStudent.homeworks[seatedStudent.homeworks.length - 1]

        const storyTopic = lastHomework.topic;
        const storyContext = lastHomework.context;

        if (
            (highlightedType === CHART_TYPE.TOPIC && highlightedCategory === storyTopic) ||
            (highlightedType === CHART_TYPE.CONTEXT && highlightedCategory === storyContext))
        {
            elStyle.backgroundColor = highlightColor;
        }

        if (nameFilter.length >= 1) {
            const [ firstName, lastName ] = seatedStudent.name.split(' ');

            if (lowerCaseStartsWith(firstName, nameFilter) || lowerCaseStartsWith(lastName, nameFilter)) {
                elStyle.backgroundColor = highlightColor;
            }
        }
    } else {
        classNames.push('empty');
    }

    return (
        <div className={classNames.join(' ')} style={elStyle} onClick={() => onSelect(seatSpec.id)}>
            {seatedStudent ?
                <div>
                    <div className='default'>{seatedStudent.name}</div>
                    <div className='hovered'>{seatSpec.perf}</div>
                </div>:
                null
            }
        </div>
    );
};

export default Seat;