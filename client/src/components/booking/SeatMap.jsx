const SeatMap = ({ seatMap, onSeatSelect, selectedSeats }) => {
    const getSeatColor = (seat) => {
        if (seat.isBooked) return 'bg-red-300 text-gray-700 cursor-not-allowed';
        if (selectedSeats.includes(seat.seatNo)) return 'bg-blue-500 text-white';
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer';
    };

    const handleSeatClick = (seat) => {
        if (seat.isBooked) return;
        onSeatSelect(seat.seatNo);
    };

    // Safety check for seatMap
    if (!seatMap || !Array.isArray(seatMap) || seatMap.length === 0) {
        return (
            <div className="seat-map">
                <div className="text-center mb-8">
                    <h3 className="text-lg font-semibold mb-6">Select Your Seat</h3>
                    <div className="text-sm text-gray-500 mb-6">Loading seat map...</div>
                </div>
            </div>
        );
    }

    // Group seats by row
    const groupedSeats = seatMap.reduce((acc, seat) => {
        const row = seat.seatNo.charAt(0);
        if (!acc[row]) acc[row] = [];
        acc[row].push(seat);
        return acc;
    }, {});

    return (
        <div className="seat-map">
            <div className="text-center mb-8">
                <h3 className="text-lg font-semibold mb-6">Select Your Seat</h3>
                <div className="text-sm text-gray-500 mb-6">Deluxe Cabin</div>
            </div>

            <div className="max-w-sm mx-auto">
                {Object.entries(groupedSeats).map(([row, seats]) => (
                    <div key={row} className="flex justify-center items-center mb-3">
                        <div className="flex gap-2">
                            {seats.slice(0, 2).map((seat) => (
                                <button
                                    key={seat.seatNo}
                                    onClick={() => handleSeatClick(seat)}
                                    className={`w-10 h-10 rounded text-sm font-medium transition-colors ${getSeatColor(seat)}`}
                                    disabled={seat.isBooked}
                                    title={seat.isBooked ? 'Seat already booked' : `Seat ${seat.seatNo}`}
                                >
                                    {seat.seatNo}
                                </button>
                            ))}
                        </div>
                        <div className="w-12"></div> {/* Aisle space */}
                        <div className="flex gap-2">
                            {seats.slice(2, 4).map((seat) => (
                                <button
                                    key={seat.seatNo}
                                    onClick={() => handleSeatClick(seat)}
                                    className={`w-10 h-10 rounded text-sm font-medium transition-colors ${getSeatColor(seat)}`}
                                    disabled={seat.isBooked}
                                    title={seat.isBooked ? 'Seat already booked' : `Seat ${seat.seatNo}`}
                                >
                                    {seat.seatNo}
                                </button>
                            ))}
                        </div>
                        <div className="w-12"></div> {/* Aisle space */}
                        <div className="flex gap-2">
                            {seats.slice(4, 6).map((seat) => (
                                <button
                                    key={seat.seatNo}
                                    onClick={() => handleSeatClick(seat)}
                                    className={`w-10 h-10 rounded text-sm font-medium transition-colors ${getSeatColor(seat)}`}
                                    disabled={seat.isBooked}
                                    title={seat.isBooked ? 'Seat already booked' : `Seat ${seat.seatNo}`}
                                >
                                    {seat.seatNo}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-8 mt-8 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span className="text-gray-600">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-300 rounded"></div>
                    <span className="text-gray-600">Booked</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Selected</span>
                </div>
            </div>
        </div>
    );
};

export default SeatMap;