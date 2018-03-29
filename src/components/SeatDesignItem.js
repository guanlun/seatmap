import React from 'react';

export default class SeatDesignItem extends React.Component {
    constructor() {
        super();
        this.dragging = false;
    }

    render() {
        const {
            seat,
        } = this.props;

        return (
            <div
                className="seat-item"
                style={{ left: seat.x, top: seat.y }}
                onMouseDown={this.handleMouseDown.bind(this)}
                onMouseMove={this.handleMouseMove.bind(this)}
                onMouseUp={this.handleMouseUp.bind(this)}>
                <div className="seat-rotator"></div>
            </div>
        );
    }

    handleMouseDown(evt) {
        this.dragging = true;
    }

    handleMouseMove(evt) {
        if (!this.dragging) {
            return;
        }

        const {
            seat,
            onPositionChange,
        } = this.props;

        const { clientX, clientY } = evt.nativeEvent;

        onPositionChange(seat.id, clientX, clientY - 95);
    }

    handleMouseUp() {
        this.dragging = false;
    }
};
