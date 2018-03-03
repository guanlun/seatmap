import React from 'react';

const Seat = ({ seatId, isSelected, onSelect }) => {
    const classNames = ['seat'];
    if (isSelected) {
        classNames.push('selected');
    }
    return (
        <div onClick={() => onSelect(seatId)} className={classNames.join(' ')}>I'm a seat</div>
    );
};

export default Seat;