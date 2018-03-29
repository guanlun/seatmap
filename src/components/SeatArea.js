import React from 'react';
import SeatDesignItem from './SeatDesignItem';

const SeatArea = ({ seats, onSeatPositionChange }) => {
    return (
        <div className="seat-area">
            {seats.map((seat, idx) =>
                <SeatDesignItem
                    key={seat.id}
                    seat={seat}
                    onPositionChange={onSeatPositionChange} />
            )}
        </div>
    );
};

export default SeatArea;