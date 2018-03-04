import { connect } from 'react-redux';
import Seats from '../components/Seats';
import { selectSeat, setStudentData, setSeatData } from '../actions';

const mapStateToProps = state => ({
    seats: state.seats,
    students: state.students,
    selectedSeat: state.selectedSeat,
});

const mapDispatchToProps = ({
    onSeatSelect: selectSeat,
    onStudentDataFetch: setStudentData,
    onSeatDataFetch: setSeatData,
});

const SeatContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Seats);

export default SeatContainer;