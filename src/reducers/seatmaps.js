const seatmaps = (state = [], action) => {
    switch (action.type) {
        case 'SEATMAP_LOADED':
            return action.data;
    }

    return state;
};

export default seatmaps;
