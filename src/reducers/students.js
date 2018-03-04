const students = (state = [], action) => {
    switch (action.type) {
        case 'SET_STUDENT_DATA':
            return action.data;
        case 'ADD_STUDENT':
            return [...state, action.data];
    }

    return state;
};

export default students;
