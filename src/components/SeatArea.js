import React from 'react';

export default class SeatArea extends React.Component {
    constructor() {
        super();
        this.dragging = false;
        this.activeSeat = undefined;
        this.mouseDownOffset = undefined;
    }

    render() {
        const { seats } = this.props;

        return (
            <div
                className="seat-area"
                onMouseMove={evt => this.handleMouseMove(evt)}
                onMouseUp={evt => this.handleMouseUp()}>
                {seats.map((seat, idx) =>
                    <div
                        className="seat-item"
                        style={{ left: seat.x, top: seat.y }}
                        key={seat.id}
                        seat={seat}
                        onMouseDown={evt => this.handleMouseDown(evt, seat)}>
                        <div className="seat-rotator"></div>
                    </div>
                )}
            </div>
        );
    }

    handleMouseDown(evt, seat) {
        this.dragging = true;
        this.activeSeat = seat;
        this.mouseDownOffset = {
            x: evt.nativeEvent.offsetX,
            y: evt.nativeEvent.offsetY,
        };
    }

    handleMouseMove(evt) {
        if (!this.dragging) {
            return;
        }

        const {
            onSeatPositionChange,
        } = this.props;

        const { clientX, clientY } = evt.nativeEvent;

        onSeatPositionChange(this.activeSeat.id, clientX - this.mouseDownOffset.x, clientY - 95 - this.mouseDownOffset.y);
    }

    handleMouseUp() {
        this.dragging = false;
        this.activeSeat = undefined;
    }
};
