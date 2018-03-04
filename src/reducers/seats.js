

const seats = (state = [], action) => {
    console.log(action);
    switch (action.type) {
        case 'SET_STUDENT_DATA':
            return action.data;
    }

    // return dummy_students;
    return [];
};

export default seats;
