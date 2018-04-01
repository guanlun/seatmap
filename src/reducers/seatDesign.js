import update from 'react-addons-update';
import { SEAT_TEMPLATE_TYPE } from '../constants';

const seatTemplates = {
    rows: [],
    circle: [],
    tables: [],
};

for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
        seatTemplates.rows.push({
            id: seatTemplates.rows.length,
            x: 20 + 150 * i,
            y: 20 + 100 * j,
            rotation: 0,
        });
    }
}

const seatDesign = (state = [], action) => {
    switch (action.type) {
        case 'SELECT_SEAT_TEMPLATE':
            return seatTemplates[action.data];
        case 'SEAT_POSITION_CHANGE':
            const seatIdx = state.findIndex(seat => seat.id === action.data.id);
            const origSeat = state[seatIdx];

            return update(state, {
                $merge: {
                    [seatIdx]: {
                        id: origSeat.id,
                        x: action.data.x || origSeat.x,
                        y: action.data.y || origSeat.y,
                        rotation: action.data.rotation || origSeat.rotation,
                    },
                },
            });
        case 'SAVE_SEAT_MAP':
            console.log('haha')
            return state;
    }
    return state;
};

export default seatDesign;
