import { combineReducers } from 'redux'
import seats from './seats';
import selectedSeat from './selectedSeat';

const seatmap = combineReducers({
    seats,
    selectedSeat,
});

export default seatmap;