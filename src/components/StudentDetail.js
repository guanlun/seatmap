import React from 'react';
import PerformanceView from './PerformanceView';
import WritingView from './WritingView';
import FaUser from 'react-icons/lib/fa/user';

const StudentDetail = ({ selectedStudent, onWritingCategorySelect }) => {
    if (!selectedStudent) {
        return <div className='student-detail hidden'></div>;
    } else {
        return (
            <div className='student-detail'>
                <div className='student-name student-detail-header'>
                    <FaUser size={32} />
                    <span>{selectedStudent.name}</span>
                </div>
                <PerformanceView studentPerformance={selectedStudent.performance} />
                <WritingView writingSpec={selectedStudent} onCategorySelect={onWritingCategorySelect} />
            </div>
        );
    }
};

export default StudentDetail;