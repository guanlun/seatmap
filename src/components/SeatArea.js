import React from 'react';

export default class SeatArea extends React.Component {
    constructor() {
        super();

        this.rotating = false;
        this.moving = false;
        this.activeSeat = undefined;
        this.mouseDownOffset = undefined;
    }

    render() {
        const { seats } = this.props;

        console.log(seats[0])

        return (
            <div
                ref="seatArea"
                className="seat-area"
                onMouseMove={evt => this.handleSeatAreaMouseMove(evt)}
                onMouseUp={evt => this.handleSeatAreaMouseUp()}>
                {seats.map((seat, idx) =>
                    <div
                        className="seat-item"
                        style={{ left: seat.x, top: seat.y, transform: `rotate(${seat.rotation}deg)` }}
                        key={seat.id}
                        onMouseDown={evt => this.handleSeatMouseDown(evt, seat)}>
                        <div
                            className="seat-rotator"
                            onMouseDown={evt => this.handleSeatRotatorMouseDown(evt, seat)}>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    handleSeatMouseDown(evt, seat) {
        if (this.moving) {
            return;
        }

        this.moving = true;
        this.activeSeat = seat;
        this.mouseDownOffset = {
            x: evt.nativeEvent.offsetX,
            y: evt.nativeEvent.offsetY,
        };
    }

    handleSeatRotatorMouseDown(evt, seat) {
        if (this.rotating) {
            return;
        }

        evt.stopPropagation();

        this.rotating = true;
        this.activeSeat = seat;
    }

    handleSeatAreaMouseMove(evt) {
        const containerOffset = this.refs.seatArea.getBoundingClientRect().y;

        const {
            onSeatPositionChange,
        } = this.props;
        const { clientX, clientY } = evt.nativeEvent;

        const seat = this.activeSeat;

        if (this.moving) {
            onSeatPositionChange(seat.id, clientX - this.mouseDownOffset.x, clientY - containerOffset - this.mouseDownOffset.y);
        } else if (this.rotating) {
            const seatMidPos = {
                x: seat.x + 100 / 2,
                y: seat.y + 60 / 2,
            };

            const dragDestAngleRad = Math.atan2(clientY - containerOffset - seatMidPos.y, clientX - seatMidPos.x);
            const rotationAngleRad = dragDestAngleRad + Math.atan2(60 / 2, 100 / 2);

            onSeatPositionChange(seat.id, seat.x, seat.y, rotationAngleRad * 180 / Math.PI);
        }
    }

    handleSeatAreaMouseUp() {
        this.moving = false;
        this.rotating = false;
        this.activeSeat = undefined;
    }
};
