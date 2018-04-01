import React from 'react';
import update from 'react-addons-update';
import SeatArea from './SeatArea';
import '../SeatDesigner.css';
import { SEAT_TEMPLATE_TYPE } from '../constants';
import { request, seatTemplates } from './Utils';

export default class SeatDesigner extends React.Component {
    constructor() {
        super();

        this.state = {
            shouldShowSeatmapNameModal: false,
            seatmapName: undefined,
            seats: [],
            seatmapsLoaded: false,
            existingSeatmaps: [],
        };
    }

    componentWillMount() {
        request({
            endpoint: 'getSeatmaps',
        }).then((resData, err) => {
            this.setState({
                seatmapsLoaded: true,
                existingSeatmaps: resData,
            });
        });
    }

    render() {
        const {
            onSeatPositionChange,
        } = this.props;

        const {
            seats,
            seatmapName,
            seatmapsLoaded,
            existingSeatmaps,
            shouldShowSeatmapNameModal,
        } = this.state;

        return (
            <div>
                {shouldShowSeatmapNameModal ? <div className="seatmap-name-overlay">
                    <div className="seatmap-name-modal">
                        <div className="seatmap-name-label">Seatmap name:</div>
                        <input ref="seatmapNameInput" defaultValue={seatmapName} className="seatmap-name-input" type="text" />
                        <button className="seatmap-name-button" onClick={this.handleSeatMapSaveConfirmBtnClick.bind(this)}>Save seatmap</button>
                        <button className="seatmap-name-button" onClick={this.handleSeatMapSaveCancelBtnClick.bind(this)}>Cancel</button>
                    </div>
                </div> : null}
                <div className="seat-designer-header">
                    <div className="seat-designer-title">Seat Designer</div>
                    <div className="seat-template-options">
                        <div
                            className="seat-template-item"
                            onClick={() => this.handleSeatTemplateClick(SEAT_TEMPLATE_TYPE.ROWS)}>
                            Rows
                        </div>
                        <div
                            className="seat-template-item"
                            onClick={() => this.handleSeatTemplateClick(SEAT_TEMPLATE_TYPE.CIRCLE)}>
                            Circle
                        </div>
                        <div
                            className="seat-template-item"
                            onClick={() => this.handleSeatTemplateClick(SEAT_TEMPLATE_TYPE.TABLES)}>
                            Tables
                        </div>
                    </div>
                    <button className="seat-designer-save-btn" onClick={this.handleSeatMapSaveBtnClick.bind(this)}>
                        Save Seatmap
                    </button>
                    <div className="existing-seatmap-list">
                        Existing seatmaps:
                        {existingSeatmaps.map(seatmap => (
                            <div key={seatmap._id} className="existing-seatmap-item" onClick={() => this.handleExistingSeatmapClick(seatmap)}>Seat Map</div>
                        ))}
                    </div>

                    <SeatArea seats={seats} onSeatPositionChange={this.handleSeatPositionChange.bind(this)} />
                </div>
            </div>
        );
    }

    handleSeatTemplateClick(templateType) {
        this.setState({
            seatmapName: undefined,
            seats: seatTemplates[templateType],
        });
    }

    handleExistingSeatmapClick(seatmap) {
        this.setState({
            seatmapName: seatmap.name,
            seats: seatmap.seats,
        });
    }

    handleSeatMapSaveBtnClick() {
        this.setState({
            shouldShowSeatmapNameModal: true,
        });
    }

    handleSeatMapSaveConfirmBtnClick() {
        const seatmapName = this.refs.seatmapNameInput.value;
        if (!seatmapName) {
            this.setState({
                shouldShowSeatmapNameModal: false,
            });
            return;
        }

        const { seats } = this.state;

        request({
            endpoint: 'saveSeatmap',
            method: 'POST',
            payload: {
                seats,
                name: seatmapName,
            },
        }).then((resData, err) => {
            this.setState({
                shouldShowSeatmapNameModal: false,
            });
        });
    }

    handleSeatMapSaveCancelBtnClick() {
        this.setState({
            shouldShowSeatmapNameModal: false,
        });
    }

    handleSeatPositionChange(seatId, x, y, rotation) {
        const { seats } = this.state;
        const seatIdx = seats.findIndex(seat => seat.id === seatId);
        const origSeat = seats[seatIdx];

        this.setState({
            seats: update(seats, {
                $merge: {
                    [seatIdx]: {
                        id: origSeat.id,
                        x: x || origSeat.x,
                        y: y || origSeat.y,
                        rotation: rotation || origSeat.rotation,
                    },
                },
            }),
        });
    }
}