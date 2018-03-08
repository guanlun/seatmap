import React from 'react';
import FaCheckSquareO from 'react-icons/lib/fa/check-square-o';

const HomeworkView = () => {
    return (
        <div>
            <div className='attendance-view student-detail-header'>
                <FaCheckSquareO size={32} />
                <span>Homeworks:</span>
            </div>
            
        </div>
    );
};

export default HomeworkView;