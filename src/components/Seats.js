import React from 'react';
import fetch from 'node-fetch';
import Seat from './Seat';
import StudentDetail from './StudentDetail';
import StudentInfoCharts from './StudentInfoCharts';
import FaSearch from 'react-icons/lib/fa/search';
import { SERVER_IP } from '../config';

const wsAddr = `ws://${SERVER_IP}:3002`;

export default class Seats extends React.Component {
    constructor() {
        super();

        this.state = {
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
        fetch(`http://${SERVER_IP}:3001/seats`)
            .then(res => res.text())
            .then(body => {
                const studentData = JSON.parse(body);
                this.props.onSeatDataFetch(studentData);
            });
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
        const { nameFilter, highlightedType, highlightedCategory, highlightColor } = this.state;

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
                </div>
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
                <StudentDetail selectedStudent={students.find(s => s.seatId === selectedSeat.id)} />
                <StudentInfoCharts students={students} onAreaSelect={this.handleChartAreaSelect.bind(this)} />
            </div>
        );
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

    _getStudentBySeat(students, seatId) {
        return students.find(student => student.seatId === seatId);
    }
}
