const students = (state = [], action) => {
    console.log(action);
    switch (action.type) {
        case 'SET_STUDENT_DATA':
            return action.data;
    }

    return state;
};

export default students;
