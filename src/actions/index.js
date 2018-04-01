export const selectSeat = seatId => ({
    type: 'SELECT_SEAT',
    id: seatId,
});

export const setStudentData = studentData => ({
    type: 'SET_STUDENT_DATA',
    data: studentData,
});

export const setSeatData = seatData => ({
    type: 'SET_SEAT_DATA',
    data: seatData,
});

export const addStudent = student => ({
    type: 'ADD_STUDENT',
    data: student,
});

export const selectSeatTemplate = template => ({
    type: 'SELECT_SEAT_TEMPLATE',
    data: template,
});

export const changeSeatPosition = (id, x, y) => ({
    type: 'SEAT_POSITION_CHANGE',
    data: { id, x, y },
});

export const saveSaetMap = () => ({
    type: 'SAVE_SEAT_MAP',
});
