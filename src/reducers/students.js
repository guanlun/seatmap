const students = (state = [], action) => {
    switch (action.type) {
        case 'SET_STUDENT_DATA':
            return action.data;
    }

    return state;
};

export default students;
