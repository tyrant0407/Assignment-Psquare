
export default function generateSeatMap(total) {
    const seats = [];
    const seatsPerRow = 6;
    const rows = Math.ceil(total / seatsPerRow);

    for (let row = 0; row < rows; row++) {
        const rowLetter = String.fromCharCode(65 + row); // A, B, C, etc.
        for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
            if (seats.length < total) {
                seats.push({
                    seatNo: `${rowLetter}${seatNum}`,
                    isBooked: false
                });
            }
        }
    }
    return seats;
}