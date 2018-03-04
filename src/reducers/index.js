import { combineReducers } from 'redux'
import seats from './seats';
import students from './students';
import selectedSeat from './selectedSeat';

const seatmap = combineReducers({
    seats,
    students,
    selectedSeat,
});

export default seatmap;