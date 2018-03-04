import React from 'react';

const Seat = ({ seatSpec, seatedStudent, isSelected, onSelect }) => {
    const classNames = ['seat'];
    if (isSelected) {
        classNames.push('selected');
    }

    if (!seatedStudent) {
        classNames.push('empty');
    }

    const elStyle = {
        left: seatSpec.position.x,
        top: seatSpec.position.y,
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