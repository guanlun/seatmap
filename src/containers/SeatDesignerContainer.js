import { connect } from 'react-redux';
import SeatDesigner from '../components/SeatDesigner';
import { selectSeatTemplate, changeSeatPosition, saveSaetMap } from '../actions';

const mapStateToProps = state => ({
    seats: state.seatDesign,
});

const mapDispatchToProps = ({
    onTemplateSelect: selectSeatTemplate,
    onSeatPositionChange: changeSeatPosition,
    onSeatMapSave: saveSaetMap,
});

const SeatDesignerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SeatDesigner);

export default SeatDesignerContainer;