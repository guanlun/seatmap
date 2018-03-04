export const selectSeat = seatId => ({
    type: 'SELECT_SEAT',
    id: seatId,
});

export const setStudentData = studentData => ({
    type: 'SET_STUDENT_DATA',
    data: studentData,
});