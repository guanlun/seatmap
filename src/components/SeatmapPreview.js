import React from 'react';
import FaEdit from 'react-icons/lib/fa/edit';

const PREVIEW_AREA_WIDTH = 400;
const PREVIEW_AREA_HEIGHT = 250;

export default class SeatmapPreview extends React.Component {
    render() {
        const { seatmap, onSelect } = this.props;

        const seatmapWidth = Math.max.apply(null, seatmap.seats.map(s => s.x)) + 200;
        const seatmapHeight = Math.max.apply(null, seatmap.seats.map(s => s.y)) + 200;

        const scaleFactor = Math.min(
            PREVIEW_AREA_WIDTH / seatmapWidth,
            PREVIEW_AREA_HEIGHT / seatmapHeight,
        );

        return (
            <div className="seatmap-preview-item" onClick={() => onSelect(seatmap)}>
                {seatmap.name}
                <div className="seats-preview">
                    <div className="seats-preview-content" style={{ transform: `scale(${scaleFactor})` }}>
                        {seatmap.seats.map((seat, idx) => (
                            <div
                                key={`seatPreview_${idx}`}
                                className="seats-preview-item" style={{ left: seat.x, top: seat.y, transform: `rotate(${seat.rotation}deg)`, }}>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="seatmap-preview-edit-button">
                    <FaEdit size="24" onClick={() => this.handleEditButtonClick(seatmap._id)} />
                </div>
            </div>
        )
    }

    handleEditButtonClick(id) {
        window.location = `/#/design/${id}`;
    }
}