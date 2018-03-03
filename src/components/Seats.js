import React from 'react';

const Seats = ({ seats, onSeatClick }) => (
    <div>
        <button onClick={onSeatClick}>Select Seat</button>
    </div>
);

export default Seats;