import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const MyBookingsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { userBookings, loading, getUserBookings } = useBookings();
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);

    useEffect(() => {
        if (user) {
            getUserBookings(user._id || user.id);
        }
    }, [user, getUserBookings]);

    useEffect(() => {
        if (userBookings && userBookings.length > 0) {
            const now = new Date();
            const upcoming = userBookings.filter(booking => {
                const bookingDate = new Date(booking.trip?.dateTime || booking.date);
                return bookingDate > now;
            });
            const past = userBookings.filter(booking => {
                const bookingDate = new Date(booking.trip?.dateTime || booking.date);
                return bookingDate <= now;
            });
            setUpcomingBookings(upcoming);
            setPastBookings(past);
        }
    }, [userBookings]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
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

    const handleManageProfile = () => {
        navigate('/profile/account-details');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin text-4xl mb-4">⏳</div>
                        <p className="text-gray-600">Loading profile...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8">
     
                {/* Upcoming Bookings Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Upcoming Bookings</h2>

                    {upcomingBookings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {upcomingBookings.slice(0, 2).map((booking, index) => (
                                <div key={booking._id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Booking ID: {booking._id?.slice(-6) || `SLK${9502 + index}`}</p>
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                                                Upcoming
                                            </span>
                                        </div>
                                        <span className="text-2xl">✈️</span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-gray-700">
                                            <span className="mr-2">✈️</span>
                                            <span>{booking.trip?.from || 'New York'} → {booking.trip?.to || 'Los Angeles'}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <span className="mr-2">📅</span>
                                            <span>{formatDate(booking.trip?.dateTime || '2024-11-15')}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <span className="mr-2">⏰</span>
                                            <span>{formatTime(booking.trip?.dateTime || '2024-11-15T09:30:00')} - {formatTime(booking.trip?.dateTime || '2024-11-15T09:30:00')}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <span className="mr-2">💺</span>
                                            <span>Seats: {booking.selectedSeats?.join(', ') || 'A2'}</span>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-center">
                                        <span className="text-blue-600 text-2xl">✈️</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Sample upcoming bookings */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Booking ID: SLK9502</p>
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                                            Upcoming
                                        </span>
                                    </div>
                                    <span className="text-2xl">✈️</span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-700">
                                        <span className="mr-2">✈️</span>
                                        <span>New York → Los Angeles</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">📅</span>
                                        <span>2024-11-15</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">⏰</span>
                                        <span>09:30 AM - 09:30 PM</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">💺</span>
                                        <span>Seats: A2</span>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-center">
                                    <span className="text-blue-600 text-2xl">✈️</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Booking ID: SLK74078</p>
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                                            Upcoming
                                        </span>
                                    </div>
                                    <span className="text-2xl">✈️</span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-700">
                                        <span className="mr-2">✈️</span>
                                        <span>Los Angeles → San Francisco</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">📅</span>
                                        <span>2024-11-21</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">⏰</span>
                                        <span>06:30 PM - 10:30 PM</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">💺</span>
                                        <span>Seats: C2</span>
                                    </div>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-center">
                                    <span className="text-blue-600 text-2xl">✈️</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Past Bookings Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Past Bookings</h2>

                    {pastBookings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {pastBookings.slice(0, 3).map((booking, index) => (
                                <div key={booking._id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Booking ID: {booking._id?.slice(-6) || `SLK${12345 + index}`}</p>
                                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                                                Completed
                                            </span>
                                        </div>
                                        <span className="text-green-600 text-xl">✅</span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-gray-700">
                                            <span className="mr-2">✈️</span>
                                            <span>{booking.trip?.from || 'Washington DC'} → {booking.trip?.to || 'Philadelphia'}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <span className="mr-2">📅</span>
                                            <span>{formatDate(booking.trip?.dateTime || '2024-09-12')}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <span className="mr-2">⏰</span>
                                            <span>{formatTime(booking.trip?.dateTime || '2024-09-12T06:00:00')} - {formatTime(booking.trip?.dateTime || '2024-09-12T12:30:00')}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <span className="mr-2">💺</span>
                                            <span>Seats: {booking.selectedSeats?.join(', ') || 'B5'}</span>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 rounded-lg p-4 flex items-center justify-center">
                                        <span className="text-green-600 text-xl">✅</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Sample past bookings */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Booking ID: SLK12345</p>
                                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                                            Completed
                                        </span>
                                    </div>
                                    <span className="text-green-600 text-xl">✅</span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-700">
                                        <span className="mr-2">✈️</span>
                                        <span>Washington DC → Philadelphia</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">📅</span>
                                        <span>2024-09-12</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">⏰</span>
                                        <span>06:00 AM - 12:30 PM</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">💺</span>
                                        <span>Seats: B5</span>
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4 flex items-center justify-center">
                                    <span className="text-green-600 text-xl">✅</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Booking ID: SLK28654</p>
                                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                                            Completed
                                        </span>
                                    </div>
                                    <span className="text-green-600 text-xl">✅</span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-700">
                                        <span className="mr-2">✈️</span>
                                        <span>Chicago → St. Louis</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">📅</span>
                                        <span>2024-10-20</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">⏰</span>
                                        <span>01:00 PM - 9:00 PM</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">💺</span>
                                        <span>Seats: A7, B8</span>
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4 flex items-center justify-center">
                                    <span className="text-green-600 text-xl">✅</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Booking ID: SLK30987</p>
                                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                                            Completed
                                        </span>
                                    </div>
                                    <span className="text-green-600 text-xl">✅</span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-700">
                                        <span className="mr-2">✈️</span>
                                        <span>Miami → Orlando</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">📅</span>
                                        <span>2024-09-18</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">⏰</span>
                                        <span>09:00 AM - 12:00 PM</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <span className="mr-2">💺</span>
                                        <span>Seats: F1</span>
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4 flex items-center justify-center">
                                    <span className="text-green-600 text-xl">✅</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MyBookingsPage;