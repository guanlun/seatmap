import React from 'react';
import Seat from './Seat';
import StudentDetail from './StudentDetail';
import StudentInfoCharts from './StudentInfoCharts';
import SeatmapPreview from './SeatmapPreview';
import FaSearch from 'react-icons/lib/fa/search';
import { SERVER_IP } from '../config';
import { request } from './Utils';

const wsAddr = `ws://${SERVER_IP}:3002`;

export default class Seats extends React.Component {
    constructor() {
        super();

        this.state = {
            seatMapSelected: false,
            seatmaps: [],
            nameFilter: '',
            highlightedType: undefined,
            highlightedCategory: undefined,
            highlightColor: undefined,
        };
    }

    componentDidMount() {
        this.fetchSeats();
        // this.fetchStudentList();

        const wsConn = new WebSocket(wsAddr);
        wsConn.onopen = () => {
            console.log('connected to ws server');
        }

        wsConn.onmessage = msg => {
            const studentInfo = JSON.parse(msg.data);
            this.props.onStudentAdd(studentInfo);
        }
    }

    fetchSeats() {
        // fetch(`http://${SERVER_IP}:3001/seats`)
        //     .then(res => res.text())
        //     .then(body => {
        //         const studentData = JSON.parse(body);
        //         this.props.onSeatDataFetch(studentData);
        //     });

        const { onSeatmapsReady } = this.props;

        request({
            endpoint: 'getSeatmaps',
        }).then(seatmaps => {
            this.setState({
                seatmaps,
            })
        })
    }

    fetchStudentList() {
        // fetch('http://localhost:3001/students')
        //     .then(res => res.text())
        //     .then(body => {
        //         const studentData = JSON.parse(body);
        //         this.props.onStudentDataFetch(studentData);
        //     });
    }

    render() {
        const { seats, students, selectedSeat, onSeatSelect, onChartAreaSelect } = this.props;
        const { seatmaps, seatMapSelected, nameFilter, highlightedType, highlightedCategory, highlightColor } = this.state;

        return (
            <div className='classroom'>
                <div className='title-container'>
                    <div className='page-title'>CLASSROOM SEAT MAP</div>
                    <div className='name-filter-container'>
                        <FaSearch size={20} />
                        <input
                            type='text'
                            ref='nameFilterInput'
                            className='name-filter-input'
                            placeholder='Filter students by name'
                            onChange={this.handleNameFilterChange.bind(this)}
                            onBlur={this.handleNameFilterBlur.bind(this)} />
                    </div>
                    <button
                        className='mock-start-button'
                        onClick={this.handleMockStudentButtonClick.bind(this)}>
                        Mock student
                    </button>
                </div>
                {seatMapSelected ?
                    <div className='seatContainer'>
                        {seats.map(seat =>
                            <Seat
                                key={seat.id}
                                isSelected={selectedSeat.id === seat.id}
                                nameFilter={nameFilter}
                                highlightedType={highlightedType}
                                highlightedCategory={highlightedCategory}
                                highlightColor={highlightColor}
                                seatSpec={seat}
                                seatedStudent={this._getStudentBySeat(students, seat.id)}
                                onSelect={onSeatSelect}/>
                        )}
                    </div>
                    :
                    <div className='seatmap-preview-container'>
                        <div>Seatmap Previews</div>
                        <div className='seatmap-preview-scroller'>
                            <div className='seatmap-preview-list'>
                                {seatmaps.map((seatmap, idx) =>
                                    <SeatmapPreview key={`seatmap_${idx}`} seatmap={seatmap} />
                                )}
                            </div>
                            <div className="seatmap-select-button">Select seatmap</div>

                            {/* TODO: edit button on seatmap itself (appear on hover)? */}
                            <div className="seatmap-edit-button">Edit seatmap</div>
                        </div>
                    </div>
                }
                <StudentDetail
                    selectedStudent={students.find(s => s.seatId === selectedSeat.id)}
                    onWritingCategorySelect={this.handleWritingCategorySelect.bind(this)} />
                <StudentInfoCharts students={students} onAreaSelect={this.handleChartAreaSelect.bind(this)} />
            </div>
        );
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

    handleNameFilterChange() {
        this.setState({
            nameFilter: this.refs.nameFilterInput.value,
            highlightColor: 'rgb(74, 182, 255)',
        });
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
