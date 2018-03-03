import { connect } from 'react-redux';
import Seats from '../components/Seats';
import { selectSeat } from '../actions';

const mapStateToProps = state => ({
    seats: state.seats,
});

const mapDispatchToProps = ({
    onSeatClick: selectSeat,
});

const SeatContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Seats);

export default SeatContainer;