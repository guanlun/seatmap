import React from 'react';
import update from 'react-addons-update';
import SeatArea from './SeatArea';
import '../SeatDesigner.css';
import { SEAT_TEMPLATE_TYPE } from '../constants';
import { request, seatTemplates, generateRowSeatmap } from './Utils';

export default class SeatDesigner extends React.Component {
    constructor() {
        super();

        this.state = {
            shouldShowSeatmapNameModal: false,
            seatmapName: undefined,
            seats: [],
            seatmapsLoaded: false,
            existingSeatmaps: [],
            rowTemplateMenuHoveredRowIdx: 0,
            rowTemplateMenuHoveredColIdx: 0,
        };
    }

    componentWillMount() {
        request({
            endpoint: 'getSeatmaps',
        }).then((resData, err) => {
            const newState = {
                seatmapsLoaded: true,
                existingSeatmaps: resData,
            };

            const preselectedSeatmapId = this.props.match.params.seatmapId;
            if (preselectedSeatmapId) {

                const preselectedSeatmap = resData.find(sm => sm._id === preselectedSeatmapId);
                newState.seatmapName = preselectedSeatmap.name;
                newState.seats = preselectedSeatmap.seats;
            }

            this.setState(newState);
        });

        document.addEventListener('keydown', evt => {
            switch (evt.keyCode) {
            case 8: // delete key

                break;
            case 90:
                if (evt.metaKey) {

                }
                break;
            }
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
            rowTemplateMenuHoveredRowIdx,
            rowTemplateMenuHoveredColIdx,
        } = this.state;

        const rowsTemplateMenu = [];

        for (let rowIdx = 0; rowIdx < 8; rowIdx++) {
            const rowsTemplateMenuRow = [];
            for (let colIdx = 0; colIdx < 8; colIdx++) {
                const isActive = rowIdx <= rowTemplateMenuHoveredRowIdx && colIdx <= rowTemplateMenuHoveredColIdx;
                rowsTemplateMenuRow.push(
                    <div
                        key={`rows-template-menu-item-${rowIdx}-${colIdx}`}
                        className={`rows-template-menu-item ${isActive ? 'active' : ''}`}
                        onMouseOver={() => this.handleRowTemplateMenuItemHover(rowIdx, colIdx)}
                        onClick={() => this.handleRowTemplateMenuItemClick(rowIdx, colIdx)}>
                    </div>
                )
            }
            rowsTemplateMenu.push(
                <div key={`row-template-menu-row-${rowIdx}`} className="rows-template-menu-row">{rowsTemplateMenuRow}</div>
            );
        }

        return (
            <div className="seat-designer">
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
                        <div>Templates:</div>
                        <div
                            className="seat-template-item"
                            onClick={() => this.handleSeatTemplateClick(SEAT_TEMPLATE_TYPE.ROWS)}>
                            Rows
                            <div className="designer-dropdown">
                                <div className="designer-dropdown-text">
                                    {`${rowTemplateMenuHoveredRowIdx + 1} x ${rowTemplateMenuHoveredColIdx + 1}`}
                                </div>
                                <div className="designer-dropdown-selection">
                                    {rowsTemplateMenu}
                                </div>
                            </div>
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
                    <div className="seatmap-edit-container">
                        {/* <div className="existing-seatmap-list">
                            Existing seatmaps:
                            {existingSeatmaps.map(seatmap => (
                                <div key={seatmap._id} className="existing-seatmap-item" onClick={() => this.handleExistingSeatmapClick(seatmap)}>Seat Map</div>
                            ))}
                        </div> */}

                        <SeatArea seats={seats} onSeatPositionChange={this.handleSeatPositionChange.bind(this)} />
                    </div>
                </div>
            </div>
        );
    }

    handleRowTemplateMenuItemHover(rowIdx, colIdx) {
        this.setState({
            rowTemplateMenuHoveredRowIdx: rowIdx,
            rowTemplateMenuHoveredColIdx: colIdx,
        });
    }

    handleRowTemplateMenuItemClick(rowIdx, colIdx) {
        const seats = generateRowSeatmap(rowIdx + 1, colIdx + 1);
        this.setState({
            seatmapName: undefined,
            seats,
        });
    }

    handleSeatTemplateClick(templateType) {
        // console.log(seatTemplates[templateType])
        // this.setState({
        //     seatmapName: undefined,
        //     seats: seatTemplates[templateType],
        // });
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
        this.saveCurrentSeatmapState();

        const { seats } = this.state;
        const seatIdx = seats.findIndex(seat => seat.id === seatId);
        const origSeat = seats[seatIdx];

        this.setState({
            seats: update(seats, {
                $merge: {
                    [seatIdx]: {
                        id: origSeat.id,
                        x,
                        y,
                        rotation,
                    },
                },
            }),
        });
    }
}