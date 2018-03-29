import { combineReducers } from 'redux'
import seats from './seats';
import students from './students';
import selectedSeat from './selectedSeat';
import seatDesign from './seatDesign';

const seatmap = combineReducers({
    seats,
    students,
    selectedSeat,
    seatDesign,
});

export default seatmap;