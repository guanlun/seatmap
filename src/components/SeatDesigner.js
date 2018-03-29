import React from 'react';
import SeatArea from './SeatArea';
import '../SeatDesigner.css';
import { SEAT_TEMPLATE_TYPE } from '../constants';

export default class SeatDesigner extends React.Component {
    render() {
        const {
            seats,
            onTemplateSelect,
            onSeatPositionChange,
        } = this.props;

        return (
            <div>
                <div className="seat-designer-header">
                    <div className="seat-designer-title">Seat Designer</div>
                    <div className="seat-template-options">
                        <div
                            className="seat-template-item"
                            onClick={() => onTemplateSelect(SEAT_TEMPLATE_TYPE.ROWS)}>
                            Rows
                        </div>
                        <div
                            className="seat-template-item"
                            onClick={() => onTemplateSelect(SEAT_TEMPLATE_TYPE.CIRCLE)}>
                            Circle
                        </div>
                        <div
                            className="seat-template-item"
                            onClick={() => onTemplateSelect(SEAT_TEMPLATE_TYPE.TABLES)}>
                            Tables
                        </div>
                    </div>

                    <SeatArea seats={seats} onSeatPositionChange={onSeatPositionChange} />
                </div>
            </div>
        );
    }
}