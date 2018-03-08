import React from 'react';
import FaCalendarCheckO from 'react-icons/lib/fa/calendar-check-o';
import FaCalendarTimesO from 'react-icons/lib/fa/calendar-times-o';

const AttendanceView = ({ attendance }) => {
    return (
        <div>
            <div className='attendance-view student-detail-header'>
                <FaCalendarCheckO size={32} />
                <span>Attendance:</span>
            </div>
            <div className='student-detail-content'>
                <div className='attendance-list'>
                    {attendance.map(attended => (
                        attended
                        ? <FaCalendarCheckO color='green' size={30} /> 
                        : <FaCalendarTimesO color='red' size={30} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AttendanceView;