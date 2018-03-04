import React from 'react';

const Seat = ({ seatSpec, isSelected, onSelect }) => {
    const classNames = ['seat'];
    if (isSelected) {
        classNames.push('selected');
    }
    return (
        <div onClick={() => onSelect(seatSpec.id)} className={classNames.join(' ')}>
            <div className='default'>{seatSpec.name}</div>
            <div className='hovered'>{seatSpec.perf}</div>
        </div>
    );
};

export default Seat;