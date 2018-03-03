import React from 'react';
import Seat from './Seat';

const Seats = ({ seats, selectedSeat, onSeatSelect }) => {
    return (
        <div>
            <div>
                {seats.map(seat => 
                    <Seat isSelected={selectedSeat.id === seat.id} seatId={seat.id} onSelect={onSeatSelect}/>
                )}
            </div>
        </div>
    );
};

export default Seats;