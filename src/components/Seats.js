import React from 'react';
import fetch from 'node-fetch';
import Seat from './Seat';
import StudentDetail from './StudentDetail';
import StudentInfoCharts from './StudentInfoCharts';

export default class Seats extends React.Component {
    componentDidMount() {
        this.fetchSeats();
        this.fetchStudentList();
    }

    fetchSeats() {
        fetch('http://localhost:3001/seats')
            .then(res => res.text())
            .then(body => {
                const studentData = JSON.parse(body);
                this.props.onSeatDataFetch(studentData);
            });
    }

    fetchStudentList() {
        fetch('http://localhost:3001/students')
            .then(res => res.text())
            .then(body => {
                const studentData = JSON.parse(body);
                this.props.onStudentDataFetch(studentData);
            });
    }

    render() {
        const { seats, students, selectedSeat, onSeatSelect } = this.props;

        return (
            <div>
                <div className='seatContainer'>
                    {seats.map(seat =>
                        <Seat 
                            key={seat.id}
                            isSelected={selectedSeat.id === seat.id}
                            seatSpec={seat}
                            seatedStudent={this._getStudentBySeat(students, seat.id)}
                            onSelect={onSeatSelect}/>
                    )}
                </div>
                <StudentDetail selectedStudent={seats.find(s => s.id === selectedSeat.id)} />
                <StudentInfoCharts students={students} />
            </div>
        );
    }

    _getStudentBySeat(students, seatId) {
        return students.find(student => student.seat.id === seatId);
    }
}
