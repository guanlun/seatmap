const seats = (state = [], action) => {
    switch (action.type) {
        case 'SET_SEAT_DATA':
            return action.data;
    }

    return state;
};

export default seats;
