import { useState } from 'react';
import { useNavigate } from 'react-router';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SeatMap from '../../components/booking/SeatMap';

// Demo trip data with seat map
const demoTrip = {
    _id: "demo-trip-1",
    title: "New York → Boston",
    from: "New York",
    to: "Boston",
    dateTime: "2024-12-25T10:30:00.000Z",
    duration: "5h 30min",
    price: 48,
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop",
    seatMap: [
        // Row A
        { seatNo: "A1", isBooked: false },
        { seatNo: "A2", isBooked: true },
        { seatNo: "A3", isBooked: false },
        { seatNo: "A4", isBooked: false },
        { seatNo: "A5", isBooked: false },
        { seatNo: "A6", isBooked: true },
        // Row B
        { seatNo: "B1", isBooked: false },
        { seatNo: "B2", isBooked: false },
        { seatNo: "B3", isBooked: true },
        { seatNo: "B4", isBooked: false },
        { seatNo: "B5", isBooked: true },
        { seatNo: "B6", isBooked: false },
        // Row C
        { seatNo: "C1", isBooked: false },
        { seatNo: "C2", isBooked: true },
        { seatNo: "C3", isBooked: false },
        { seatNo: "C4", isBooked: false },
        { seatNo: "C5", isBooked: false },
        { seatNo: "C6", isBooked: true },
        // Row D
        { seatNo: "D1", isBooked: true },
        { seatNo: "D2", isBooked: false },
        { seatNo: "D3", isBooked: true },
        { seatNo: "D4", isBooked: false },
        { seatNo: "D5", isBooked: false },
        { seatNo: "D6", isBooked: true },
        // Row E
        { seatNo: "E1", isBooked: true },
        { seatNo: "E2", isBooked: true },
        { seatNo: "E3", isBooked: false },
        { seatNo: "E4", isBooked: false },
        { seatNo: "E5", isBooked: false },
        { seatNo: "E6", isBooked: false },
        // Row F
        { seatNo: "F1", isBooked: false },
        { seatNo: "F2", isBooked: true },
        { seatNo: "F3", isBooked: true },
        { seatNo: "F4", isBooked: true },
        { seatNo: "F5", isBooked: false },
        { seatNo: "F6", isBooked: true },
    ]
};

const BookingDemo = () => {
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState([]);

    const handleSeatSelect = (seatNo) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatNo)) {
                return prev.filter(seat => seat !== seatNo);
            } else {
                return [...prev, seatNo];
            }
        });
    };

    const handleConfirmBooking = () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }

        // Navigate to payment page with booking data
        navigate('/payment', {
            state: {
                trip: demoTrip,
                selectedSeats,
                totalAmount: demoTrip.price * selectedSeats.length
            }
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Demo</h1>
                    <p className="text-gray-600">This is a demonstration of the booking and seat selection functionality.</p>
                </div>

                {/* Trip Image */}
                <div className="mb-8">
                    <img
                        src={demoTrip.image}
                        alt={`${demoTrip.from} to ${demoTrip.to}`}
                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                    />
                </div>

                {/* Trip Details */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Trip Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <span className="text-lg font-semibold capitalize">{demoTrip.from}</span>
                                    <span className="mx-2 text-gray-500">→</span>
                                    <span className="text-lg font-semibold capitalize">{demoTrip.to}</span>
                                </div>
                            </div>

                            <div className="space-y-2 text-gray-600">
                                <div>
                                    <span className="font-medium">Date:</span> {formatDate(demoTrip.dateTime)}
                                </div>
                                <div>
                                    <span className="font-medium">Time:</span> {formatTime(demoTrip.dateTime)}
                                </div>
                                <div>
                                    <span className="font-medium">Duration:</span> {demoTrip.duration}
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                ${demoTrip.price}
                            </div>
                            <div className="text-sm text-gray-500">Fare per seat</div>
                        </div>
                    </div>
                </div>

                {/* Seat Selection */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <SeatMap
                        seatMap={demoTrip.seatMap}
                        onSeatSelect={handleSeatSelect}
                        selectedSeats={selectedSeats}
                    />
                </div>

                {/* Selected Seats */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">Selected Seats</h3>
                    {selectedSeats.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {selectedSeats.map(seat => (
                                <span
                                    key={seat}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                >
                                    {seat}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No seats selected</p>
                    )}

                    {selectedSeats.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">
                                    Total: ${demoTrip.price * selectedSeats.length}
                                </span>
                                <span className="text-sm text-gray-600">
                                    {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirm Booking Button */}
                <div className="text-center">
                    <button
                        onClick={handleConfirmBooking}
                        disabled={selectedSeats.length === 0}
                        className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${selectedSeats.length > 0
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Confirm Booking
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BookingDemo;