import React from 'react';

const AttendanceView = ({ attendance }) => {
    return (
        <div className='attendance-view'>
            <p>Attendance:</p>
            <div className='attendance-list'>
                {attendance.map(attended => (
                    <div className={`attendance-item ${attended ? 'attended' : 'absent'}`}></div>
                ))}
            </div>
        </div>
    );
};

export default AttendanceView;