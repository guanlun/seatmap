import { connect } from 'react-redux';
import Seats from '../components/Seats';
import { selectSeat, setStudentData } from '../actions';

const mapStateToProps = state => ({
    seats: state.seats,
    selectedSeat: state.selectedSeat,
});

const mapDispatchToProps = ({
    onSeatSelect: selectSeat,
    onStudentDataFetch: setStudentData,
});

const SeatContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Seats);

export default SeatContainer;