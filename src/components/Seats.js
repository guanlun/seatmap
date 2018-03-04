import React from 'react';
import fetch from 'node-fetch';
import Seat from './Seat';
import StudentDetail from './StudentDetail';

export default class Seats extends React.Component {
    componentDidMount() {
        this.fetchStudentList();
    }

    fetchStudentList() {
        fetch('http://localhost:3001/')
            .then(res => res.text())
            .then(body => {
                const studentData = JSON.parse(body);
                this.props.onStudentDataFetch(studentData);
            });
    }

    render() {
        const { seats, selectedSeat, onSeatSelect } = this.props;

        return (
            <div>
                <div className='seatContainer'>
                    {seats.map(seat =>
                        <Seat 
                            key={seat.id}
                            isSelected={selectedSeat.id === seat.id}
                            seatSpec={seat}
                            onSelect={onSeatSelect}/>
                    )}
                </div>
                <StudentDetail selectedStudent={seats.find(s => s.id === selectedSeat.id)} />
            </div>
        );
    }
}
