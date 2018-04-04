import React from 'react';
import { CHART_TYPE } from '../constants';

const Seat = ({ seatSpec, seatedStudent, isSelected, onSelect, highlightedType, highlightedCategory }) => {
    const classNames = ['seat'];
    if (isSelected) {
        classNames.push('selected');
    }

    if (seatedStudent) {
        const { storyTopic, storyContext } = seatedStudent;

        // console.log(highlightedType, highlightedCategory, )

        if (highlightedType === CHART_TYPE.TOPIC && highlightedCategory === storyTopic) {
            classNames.push('highlighted')
        }
    } else {
        classNames.push('empty');
    }

    const elStyle = {
        left: seatSpec.position.x,
        top: seatSpec.position.y + 60,
    };

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