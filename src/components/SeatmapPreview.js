import React from 'react';

export default class SeatmapPreview extends React.Component {
    render() {
        const { seatmap } = this.props;

        return (
            <div className="seatmap-preview-item">
                {seatmap.name}
                <div className="seats-preview">
                    <div className="seats-preview-content">
                        {seatmap.seats.map((seat, idx) => (
                            <div
                                key={`seatPreview_${idx}`}
                                className="seats-preview-item" style={{ left: seat.x, top: seat.y }}>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }
}