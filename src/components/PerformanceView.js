import React from 'react';
import AttendanceView from './AttendanceView';

const PerformanceView = ({ studentPerformance }) => {
    return (
        <div className='performance-view'>
            <AttendanceView attendance={studentPerformance.attendance} />
        </div>
    );
};

export default PerformanceView;