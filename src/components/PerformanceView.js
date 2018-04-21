import React from 'react';
import AttendanceView from './AttendanceView';
import HomeworkView from './HomeworkView';

const PerformanceView = ({ studentPerformance }) => {
    return (
        <div className='performance-view'>
            <AttendanceView attendance={studentPerformance.attendance} />
            <HomeworkView grades={studentPerformance.grades} />
        </div>
    );
};

export default PerformanceView;