import React from 'react';
import PerformanceView from './PerformanceView';
import WritingView from './WritingView';
import FaUser from 'react-icons/lib/fa/user';

const StudentDetail = ({ selectedStudent, students, onWritingCategorySelect, onCommonWordSelect }) => {
    if (!selectedStudent) {
        return <div className='student-detail hidden'></div>;
    } else {
        const numHomeworks = selectedStudent.homeworks.length;
        return (
            <div className='student-detail'>
                <div className='student-name student-detail-header'>
                    <FaUser size={32} />
                    <span>{selectedStudent.name}</span>
                </div>
                <PerformanceView studentPerformance={selectedStudent.performance} />
                {numHomeworks ?
                    <WritingView
                        writingSpec={selectedStudent.homeworks[numHomeworks - 1]}
                        students={students}
                        onCategorySelect={onWritingCategorySelect}
                        onCommonWordSelect={onCommonWordSelect} />
                    : null
                }
            </div>
        );
    }
};

export default StudentDetail;