import React from 'react';
import PerformanceView from './PerformanceView';

const StudentDetail = ({ selectedStudent }) => {
    if (!selectedStudent) {
        return <div className='student-detail hidden'></div>;
    } else {
        return (
            <div className='student-detail'>
                {selectedStudent.name}
                <PerformanceView studentPerformance={selectedStudent.performance} />
            </div>
        )
    }
};

export default StudentDetail;