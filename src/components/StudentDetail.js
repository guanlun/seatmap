import React from 'react';

const StudentDetail = ({ selectedStudent }) => {
    if (!selectedStudent) {
        return <div className='student-detail hidden'></div>;
    } else {
        return (
            <div className='student-detail'>
                {selectedStudent.name}
            </div>
        )
    }
};

export default StudentDetail;