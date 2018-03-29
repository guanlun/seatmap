import { connect } from 'react-redux';
import SeatDesigner from '../components/SeatDesigner';
import { selectSeatTemplate, changeSeatPosition } from '../actions';

const mapStateToProps = state => ({
    seats: state.seatDesign,
});

const mapDispatchToProps = ({
    onTemplateSelect: selectSeatTemplate,
    onSeatPositionChange: changeSeatPosition,
});

const SeatDesignerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SeatDesigner);

export default SeatDesignerContainer;