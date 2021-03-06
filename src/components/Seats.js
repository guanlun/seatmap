import React from 'react';
import Seat from './Seat';
import StudentDetail from './StudentDetail';
import StudentInfoCharts from './StudentInfoCharts';
import SeatmapPreview from './SeatmapPreview';
import FaSearch from 'react-icons/lib/fa/search';
import { SERVER_HOST } from '../config';
import { request } from './Utils';

const wsAddr = `ws://${SERVER_HOST}:3002`;

export default class Seats extends React.Component {
    constructor() {
        super();

        this.state = {
            students: [],
            selectedSeatmap: undefined,
            seatAreaHeight: 400,
            seatmaps: [],
            nameFilter: '',
            highlightedType: undefined,
            highlightedCategory: undefined,
            highlightColor: undefined,
        };
    }

    componentDidMount() {
        this.fetchSeats();
        this.fetchStudentList();

        const wsConn = new WebSocket(wsAddr);
        wsConn.onopen = () => {
            console.log('connected to ws server');
        }

        wsConn.onmessage = msg => {
            const studentInfo = JSON.parse(msg.data);
            this.setState({
                students: [...this.state.students, studentInfo],
            });
            // this.props.onStudentAdd(studentInfo);
        }

        // TODO: delete:
        // this.handleMockStudentButtonClick();
    }

    fetchSeats() {
        const { onSeatmapsReady } = this.props;

        request({
            endpoint: 'getSeatmaps',
        }).then(seatmaps => {
            this.setState({
                seatmaps,
            })
        });
    }

    fetchStudentList() {
        request({
            endpoint: 'students',
        }).then(students => {
            this.setState({
                students,
            });
        });
    }

    render() {
        const { seats, selectedSeat, onSeatSelect, onChartAreaSelect } = this.props;
        const { students, seatmaps, selectedSeatmap, nameFilter, highlightedType, highlightedCategory, highlightColor, seatAreaHeight } = this.state;

        const minSeatPos = {
            x: 0,
            y: 0,
        };
        if (selectedSeatmap) {
            minSeatPos.x = Math.min(...selectedSeatmap.seats.map(s => s.x));
            minSeatPos.y = Math.min(...selectedSeatmap.seats.map(s => s.y));
        }

        return (
            <div className='classroom'>
                <div className='title-container'>
                    <div className='page-title'>Classroom Seat Map</div>
                    <div className='name-filter-container'>
                        <FaSearch size={20} />
                        <input
                            type='text'
                            ref='nameFilterInput'
                            className='name-filter-input'
                            placeholder='Filter students by name'
                            onChange={this.handleNameFilterChange.bind(this)}
                            onFocus={this.handleNameFilterFocus.bind(this)}
                            onBlur={this.handleNameFilterBlur.bind(this)} />
                    </div>
                    <button
                        className='mock-start-button'
                        onClick={this.handleMockStudentButtonClick.bind(this)}>
                        Mock students
                    </button>
                </div>
                {selectedSeatmap ?
                    <div className='seat-outer'>
                        <div className='seatContainer' style={{ height: seatAreaHeight }}>
                            {selectedSeatmap.seats.map(seat =>
                                <Seat
                                    key={seat.id}
                                    isSelected={selectedSeat.id === seat.id}
                                    nameFilter={nameFilter}
                                    highlightedType={highlightedType}
                                    highlightedCategory={highlightedCategory}
                                    highlightColor={highlightColor}
                                    seatSpec={seat}
                                    minSeatPos={minSeatPos}
                                    seatedStudent={this._getStudentBySeat(students, seat.id)}
                                    onSelect={onSeatSelect}/>
                            )}
                        </div>
                        <StudentDetail
                            selectedStudent={students.find(s => s.seatId === selectedSeat.id)}
                            students={students}
                            onWritingCategorySelect={this.handleWritingCategorySelect.bind(this)}
                            onCommonWordSelect={this.handleCommonWordSelect.bind(this)} />
                        <StudentInfoCharts
                            students={students}
                            onAreaSelect={this.handleChartAreaSelect.bind(this)}
                            onAreaDeselect={this.handleChartAreaDeselect.bind(this)} />
                    </div>
                    :
                    <div className='seatmap-preview-container'>
                        <div className='seatmap-preview-list'>
                            {seatmaps.map((seatmap, idx) =>
                                <SeatmapPreview
                                    key={`seatmap_${idx}`}
                                    seatmap={seatmap}
                                    onSelect={this.handleSeatmapSelect.bind(this)} />
                            )}
                        </div>
                    </div>
                }
            </div>
        );
    }

    handleCommonWordSelect(student) {
        const { onSeatSelect } = this.props;
        onSeatSelect(student.seatId);
    }

    handleSeatmapSelect(seatmap) {
        this.setState({
            selectedSeatmap: seatmap,
            seatAreaHeight: Math.max(...seatmap.seats.map(s => s.y)),
        });
    }

    handleWritingCategorySelect(categoryType, selectedCategory) {
        this.setState({
            highlightedType: categoryType,
            highlightedCategory: selectedCategory,
            highlightColor: 'rgb(54, 162, 235)',
        })
    }

    handleChartAreaSelect(chartType, selectedLabel, color) {
        this.setState({
            highlightedType: chartType,
            highlightedCategory: selectedLabel,
            highlightColor: color,
        })
    }

    handleChartAreaDeselect() {
        this.setState({
            highlightedType: null,
            highlightedCategory: null,
        })
    }

    handleNameFilterChange() {
        this.setState({
            nameFilter: this.refs.nameFilterInput.value,
            highlightColor: 'rgb(74, 182, 255)',
        });
    }

    handleNameFilterFocus() {
        const { onSeatSelect } = this.props;
        onSeatSelect(null);
    }

    handleNameFilterBlur() {
        this.refs.nameFilterInput.value = '';

        this.setState({
            nameFilter: '',
            highlightColor: undefined,
        });
    }

    handleMockStudentButtonClick() {
        request({
            endpoint: 'beginMockingStudents',
        });
    }

    _getStudentBySeat(students, seatId) {
        return students.find(student => student.seatId === seatId);
    }
}
