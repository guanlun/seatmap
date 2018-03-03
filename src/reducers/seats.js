const dummy_seats = [
    {
        id: 1,
    }, 
    {
        id: 2,
    }, 
    {
        id: 3,
    }, 
    {
        id: 4,
    }, 
]

const seats = (state = [], action) => {
    console.log(action)
    switch (action.type) {
        case 'ADD_SEAT':
            return [];
            break;
    }

    return dummy_seats;
};

export default seats;
