const seats = (state = [], action) => {
    switch (action.type) {
        case 'SET_SEAT_DATA':
            return action.data;
        case 'SEATMAP_LOADED':
            return state;
    }

    return state;
};

export default seats;
