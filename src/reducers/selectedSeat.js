const selectedSeat = (state = {}, action) => {
    switch (action.type) {
        case 'SELECT_SEAT':
            return {
                id: action.id
            };
    }

    return state;
};

export default selectedSeat;
