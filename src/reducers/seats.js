const seats = (state = [], action) => {
    switch (action.type) {
        case 'SET_SEAT_DATA':
        console.log('seat data fetched', action.data)
            return action.data;
    }

    return state;
};

export default seats;
