import { connect } from 'react-redux';
import Seats from '../components/Seats';
import { selectSeat } from '../actions';

const mapStateToProps = state => ({
    seats: state.seats,
    selectedSeat: state.selectedSeat,
});

const mapDispatchToProps = ({
    onSeatSelect: selectSeat,
});

const SeatContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Seats);

export default SeatContainer;