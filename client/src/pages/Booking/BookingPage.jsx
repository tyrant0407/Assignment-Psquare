import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTrips } from '../../hooks/useTrips';
import { useBookings } from '../../hooks/useBookings';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SeatMap from '../../components/booking/SeatMap';

const BookingPage = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { currentTrip, loading, error, getTripById, clearCurrentTripData } = useTrips();
    const { createBooking, loading: bookingLoading, bookings } = useBookings();
    const [selectedSeats, setSelectedSeats] = useState([]);

    useEffect(() => {
        if (tripId) {
            getTripById(tripId);
        }

        // Cleanup function to clear current trip when component unmounts
        return () => {
            clearCurrentTripData();
        };
    }, [tripId, getTripById, clearCurrentTripData]);

    const handleSeatSelect = (seatNo) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatNo)) {
                return prev.filter(seat => seat !== seatNo);
            } else {
                return [...prev, seatNo];
            }
        });
    };

    const handleConfirmBooking = async () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }

        if (!user) {
            alert('Please login to continue with booking');
            navigate('/login');
            return;
        }

        if (!currentTrip) {
            alert('Trip data not available. Please try again.');
            return;
        }

        try {
            // Create booking using Redux
            const bookingData = {
                tripId: currentTrip._id,
                selectedSeats,
                totalAmount: currentTrip.price * selectedSeats.length
            };

            const success = await createBooking(bookingData);

            if (success) {
                // Get the created booking from Redux state (most recent booking)
                const createdBooking = bookings[0];
                const bookingId = createdBooking?._id || createdBooking?.id;

                // Navigate to payment page with booking ID and trip data
                navigate('/payment', {
                    state: {
                        bookingId,
                        trip: currentTrip,
                        selectedSeats,
                        totalAmount: currentTrip.price * selectedSeats.length
                    }
                });
            } else {
                alert('Failed to create booking. Please try again.');
            }
        } catch (err) {
            console.error('Failed to create booking:', err);
            alert('Failed to create booking. Please try again.');
        }
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-lg">Loading trip details...</div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || (!loading && !currentTrip)) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-lg text-red-600">{error || 'Trip not found'}</div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8">
                {currentTrip && (
                    <>
                        {/* Trip Image */}
                        <div className="mb-8">
                            <img
                                src={currentTrip.image}
                                alt={`${currentTrip.from} to ${currentTrip.to}`}
                                className="w-full h-54 object-cover"
                            />
                        </div>

                        {/* Trip Details */}
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                            <h1 className="text-2xl font-bold mb-6">Trip Details</h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <span className="text-lg font-semibold capitalize">{currentTrip.from}</span>
                                            <span className="mx-2 text-gray-500">→</span>
                                            <span className="text-lg font-semibold capitalize">{currentTrip.to}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-gray-600">
                                        <div>
                                            <span className="font-medium">Date:</span> {formatDate(currentTrip.dateTime)}
                                        </div>
                                        <div>
                                            <span className="font-medium">Time:</span> {formatTime(currentTrip.dateTime)}
                                        </div>
                                        <div>
                                            <span className="font-medium">Duration:</span> {currentTrip.duration}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-3xl font-bold text-blue-600 mb-2">
                                        ${currentTrip.price}
                                    </div>
                                    <div className="text-sm text-gray-500">Fare per seat</div>
                                </div>
                            </div>
                        </div>

                        {/* Seat Selection */}
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                            <SeatMap
                                seatMap={currentTrip.seatMap}
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
                                            Total: ${currentTrip.price * selectedSeats.length}
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
                                disabled={selectedSeats.length === 0 || bookingLoading}
                                className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${selectedSeats.length > 0 && !bookingLoading
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {bookingLoading ? 'Creating Booking...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default BookingPage;