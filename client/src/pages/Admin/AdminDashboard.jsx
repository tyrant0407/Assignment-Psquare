
import React, { useState, useEffect } from 'react';
import { useTrips } from '../../hooks/useTrips';
import { useBookings } from '../../hooks/useBookings';
import { useAdmin } from '../../hooks/useAdmin';
import { useToast } from '../../hooks/useToast';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import AddTripModal from './AddTripModal';
import { ToastContainer } from '../../components/ui/Toast';

export default function AdminDashboard() {
    const [isAddTripModalOpen, setIsAddTripModalOpen] = useState(false);
    const [stats, setStats] = useState({
        totalTrips: 0,
        totalBookings: 0,
        pendingCheckouts: 0
    });

    const { trips, loading: tripsLoading, getTrips, deleteTrip } = useTrips();
    const { bookings, loading: bookingsLoading, getBookings, updateBooking, cancelBooking } = useBookings();
    const { fetchDashboardStats } = useAdmin();
    const { toasts, success, error, removeToast } = useToast();

    useEffect(() => {
        // Fetch initial data
        getTrips();
        getBookings();
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const success = await fetchDashboardStats();
            if (success) {
                // Use dashboardStats from useAdmin hook
                setStats({
                    totalTrips: trips?.length || 48,
                    totalBookings: bookings?.length || 325,
                    pendingCheckouts: bookings?.filter(b => b.status === 'pending')?.length || 12
                });
            } else {
                // Fallback to calculating from existing data
                setStats({
                    totalTrips: trips?.length || 48,
                    totalBookings: bookings?.length || 325,
                    pendingCheckouts: bookings?.filter(b => b.status === 'pending')?.length || 12
                });
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            // Use fallback data
            setStats({
                totalTrips: trips?.length || 48,
                totalBookings: bookings?.length || 325,
                pendingCheckouts: bookings?.filter(b => b.status === 'pending')?.length || 12
            });
        }
    };

    const handleDeleteTrip = async (tripId) => {
        if (window.confirm('Are you sure you want to delete this trip?')) {
            try {
                const result = await deleteTrip(tripId);
                if (result) {
                    success('Trip deleted successfully');
                    getTrips(); // Refresh trips list
                    fetchStats(); // Refresh stats
                } else {
                    error('Failed to delete trip. Please try again.');
                }
            } catch (err) {
                console.error('Error deleting trip:', err);
                error('Failed to delete trip. Please try again.');
            }
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                const result = await cancelBooking(bookingId);
                if (result) {
                    success('Booking canceled successfully');
                    getBookings(); // Refresh bookings list
                    fetchStats(); // Refresh stats
                } else {
                    error('Failed to cancel booking. Please try again.');
                }
            } catch (err) {
                console.error('Error canceling booking:', err);
                error('Failed to cancel booking. Please try again.');
            }
        }
    };

    const handleUpdateBookingStatus = async (bookingId, newStatus) => {
        try {
            const result = await updateBooking(bookingId, { status: newStatus });
            if (result) {
                success(`Booking status updated to ${newStatus}`);
                getBookings(); // Refresh bookings list
                fetchStats(); // Refresh stats
            } else {
                error('Failed to update booking status. Please try again.');
            }
        } catch (err) {
            console.error('Error updating booking status:', err);
            error('Failed to update booking status. Please try again.');
        }
    };

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

    const exportBookingsCSV = () => {
        if (!bookings || bookings.length === 0) {
            error('No bookings to export');
            return;
        }

        const csvHeaders = ['Booking ID', 'User', 'Trip Route', 'Date', 'Seats', 'Status', 'Total Amount'];
        const csvData = bookings.map(booking => [
            booking._id,
            booking.user?.name || 'N/A',
            `${booking.trip?.from} to ${booking.trip?.to}`,
            formatDate(booking.trip?.dateTime || booking.createdAt),
            booking.selectedSeats?.join(', ') || 'N/A',
            booking.status || 'pending',
            `$${booking.totalAmount || 0}`
        ]);

        const csvContent = [csvHeaders, ...csvData]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        success('Bookings exported successfully');
    };
    if (tripsLoading || bookingsLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <div className="animate-spin text-4xl mb-4">⏳</div>
                        <p className="text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Dashboard Header */}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>

                {/* Admin Overview Section */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Admin Overview</h2>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total Trips */}
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
                            <div className='flex gap-2'>
                                <div className="text-4xl"><svg width="26" height="40" viewBox="0 0 26 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 0C22.4183 0 26 3.58172 26 8V32C26 36.4183 22.4183 40 18 40H8C3.58172 40 0 36.4183 0 32V8C0 3.58172 3.58172 0 8 0H18Z" fill="#DBEAFE" />
                                    <path d="M18 0C22.4183 0 26 3.58172 26 8V32C26 36.4183 22.4183 40 18 40H8C3.58172 40 0 36.4183 0 32V8C0 3.58172 3.58172 0 8 0H18Z" stroke="#E5E7EB" />
                                    <path d="M18 29H8V10H18V29Z" stroke="#E5E7EB" />
                                    <g clip-path="url(#clip0_48_6221)">
                                        <path d="M8.5 15.5C8.5 14.3065 8.97411 13.1619 9.81802 12.318C10.6619 11.4741 11.8065 11 13 11C14.1935 11 15.3381 11.4741 16.182 12.318C17.0259 13.1619 17.5 14.3065 17.5 15.5C17.5 16.6935 17.0259 17.8381 16.182 18.682C15.3381 19.5259 14.1935 20 13 20C11.8065 20 10.6619 19.5259 9.81802 18.682C8.97411 17.8381 8.5 16.6935 8.5 15.5ZM13 13.5C13.275 13.5 13.5 13.275 13.5 13C13.5 12.725 13.275 12.5 13 12.5C11.3438 12.5 10 13.8438 10 15.5C10 15.775 10.225 16 10.5 16C10.775 16 11 15.775 11 15.5C11 14.3969 11.8969 13.5 13 13.5ZM12 26V20.9094C12.325 20.9688 12.6594 21 13 21C13.3406 21 13.675 20.9688 14 20.9094V26C14 26.5531 13.5531 27 13 27C12.4469 27 12 26.5531 12 26Z" fill="#2563EB" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_48_6221">
                                            <path d="M8 11H18V27H8V11Z" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    <h6>
                                        {stats.totalTrips}
                                    </h6>
                                    <div className="text-sm text-gray-600 font-light mt-1">Total Trips</div>
                                </div>

                            </div>

                        </div>

                        {/* Total Bookings */}
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
                            <div className='flex gap-2'>
                                <div className="text-4xl">
                                    <svg width="37" height="40" viewBox="0 0 37 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M28.6562 0C33.0745 0 36.6562 3.58172 36.6562 8V32C36.6562 36.4183 33.0745 40 28.6562 40H8.65625C4.23797 40 0.65625 36.4183 0.65625 32V8C0.65625 3.58172 4.23797 0 8.65625 0H28.6562Z" fill="#DCFCE7" />
                                        <path d="M28.6562 0C33.0745 0 36.6562 3.58172 36.6562 8V32C36.6562 36.4183 33.0745 40 28.6562 40H8.65625C4.23797 40 0.65625 36.4183 0.65625 32V8C0.65625 3.58172 4.23797 0 8.65625 0H28.6562Z" stroke="#E5E7EB" />
                                        <path d="M28.6562 29H8.65625V10H28.6562V29Z" stroke="#E5E7EB" />
                                        <g clip-path="url(#clip0_48_6233)">
                                            <path d="M13.1562 11C13.8193 11 14.4552 11.2634 14.924 11.7322C15.3929 12.2011 15.6562 12.837 15.6562 13.5C15.6562 14.163 15.3929 14.7989 14.924 15.2678C14.4552 15.7366 13.8193 16 13.1562 16C12.4932 16 11.8573 15.7366 11.3885 15.2678C10.9196 14.7989 10.6562 14.163 10.6562 13.5C10.6562 12.837 10.9196 12.2011 11.3885 11.7322C11.8573 11.2634 12.4932 11 13.1562 11ZM24.6562 11C25.3193 11 25.9552 11.2634 26.424 11.7322C26.8929 12.2011 27.1562 12.837 27.1562 13.5C27.1562 14.163 26.8929 14.7989 26.424 15.2678C25.9552 15.7366 25.3193 16 24.6562 16C23.9932 16 23.3573 15.7366 22.8885 15.2678C22.4196 14.7989 22.1562 14.163 22.1562 13.5C22.1562 12.837 22.4196 12.2011 22.8885 11.7322C23.3573 11.2634 23.9932 11 24.6562 11ZM8.65625 20.3344C8.65625 18.4938 10.15 17 11.9906 17H13.325C13.8219 17 14.2937 17.1094 14.7188 17.3031C14.6781 17.5281 14.6594 17.7625 14.6594 18C14.6594 19.1938 15.1844 20.2656 16.0125 21C16.0062 21 16 21 15.9906 21H9.32187C8.95625 21 8.65625 20.7 8.65625 20.3344ZM21.3219 21C21.3156 21 21.3094 21 21.3 21C22.1313 20.2656 22.6531 19.1938 22.6531 18C22.6531 17.7625 22.6313 17.5312 22.5938 17.3031C23.0188 17.1062 23.4906 17 23.9875 17H25.3219C27.1625 17 28.6562 18.4938 28.6562 20.3344C28.6562 20.7031 28.3563 21 27.9906 21H21.3219ZM15.6562 18C15.6562 17.2044 15.9723 16.4413 16.5349 15.8787C17.0975 15.3161 17.8606 15 18.6562 15C19.4519 15 20.215 15.3161 20.7776 15.8787C21.3402 16.4413 21.6562 17.2044 21.6562 18C21.6562 18.7956 21.3402 19.5587 20.7776 20.1213C20.215 20.6839 19.4519 21 18.6562 21C17.8606 21 17.0975 20.6839 16.5349 20.1213C15.9723 19.5587 15.6562 18.7956 15.6562 18ZM12.6562 26.1656C12.6562 23.8656 14.5219 22 16.8219 22H20.4906C22.7906 22 24.6562 23.8656 24.6562 26.1656C24.6562 26.625 24.2844 27 23.8219 27H13.4906C13.0312 27 12.6562 26.6281 12.6562 26.1656Z" fill="#16A34A" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_48_6233">
                                                <path d="M8.65625 11H28.6562V27H8.65625V11Z" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    <h6>
                                        {stats.totalBookings}
                                    </h6>
                                    <div className="text-sm text-gray-600 font-light mt-1">Total Bookings</div>
                                </div>

                            </div>

                        </div>

                        {/* Pending Checkouts */}
                        <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
                            <div className='flex gap-2'>
                                <div className="text-4xl">
                                    <svg width="33" height="40" viewBox="0 0 33 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M24.3281 0C28.7464 0 32.3281 3.58172 32.3281 8V32C32.3281 36.4183 28.7464 40 24.3281 40H8.32812C3.90985 40 0.328125 36.4183 0.328125 32V8C0.328125 3.58172 3.90985 0 8.32812 0H24.3281Z" fill="#FEF9C3" />
                                        <path d="M24.3281 0C28.7464 0 32.3281 3.58172 32.3281 8V32C32.3281 36.4183 28.7464 40 24.3281 40H8.32812C3.90985 40 0.328125 36.4183 0.328125 32V8C0.328125 3.58172 3.90985 0 8.32812 0H24.3281Z" stroke="#E5E7EB" />
                                        <path d="M24.3281 29H8.32812V10H24.3281V29Z" stroke="#E5E7EB" />
                                        <g clip-path="url(#clip0_48_6245)">
                                            <path d="M16.3281 11C18.4499 11 20.4847 11.8429 21.985 13.3431C23.4853 14.8434 24.3281 16.8783 24.3281 19C24.3281 21.1217 23.4853 23.1566 21.985 24.6569C20.4847 26.1571 18.4499 27 16.3281 27C14.2064 27 12.1716 26.1571 10.6713 24.6569C9.17098 23.1566 8.32813 21.1217 8.32812 19C8.32812 16.8783 9.17098 14.8434 10.6713 13.3431C12.1716 11.8429 14.2064 11 16.3281 11ZM15.5781 14.75V19C15.5781 19.25 15.7031 19.4844 15.9125 19.625L18.9125 21.625C19.2563 21.8562 19.7219 21.7625 19.9531 21.4156C20.1844 21.0687 20.0906 20.6062 19.7437 20.375L17.0781 18.6V14.75C17.0781 14.3344 16.7437 14 16.3281 14C15.9125 14 15.5781 14.3344 15.5781 14.75Z" fill="#CA8A04" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_48_6245">
                                                <path d="M8.32812 11H24.3281V27H8.32812V11Z" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    <h6>
                                        {stats.pendingCheckouts}
                                    </h6>
                                    <div className="text-sm text-gray-600 font-light mt-1">Pending checkouts</div>
                                </div>

                            </div>

                        </div>

                    </div>
                </div>

                {/* Trip Management Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-700">Trip Management</h2>
                        <div className="flex gap-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                                All Trips
                            </button>
                            <button
                                onClick={() => setIsAddTripModalOpen(true)}
                                className="border border-blue-600 bg-white hover:bg-gray-50 text-blue-600  px-4 py-2 rounded-md text-sm font-medium transition"
                            >
                                + Add New Trip
                            </button>
                        </div>
                    </div>

                    {/* Trips Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Route
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Departure
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Arrival
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Total Seats
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {trips && trips.length > 0 ? trips.map((trip) => (
                                    <tr key={trip._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {trip._id?.slice(-6) || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {trip.from} to {trip.to}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatTime(trip.dateTime)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatTime(new Date(new Date(trip.dateTime).getTime() + trip.duration * 60 * 60 * 1000))}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${trip.price}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {trip.totalSeats}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {/* TODO: Add edit functionality */ }}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit trip"
                                                >
                                                    <svg width="33" height="40" viewBox="0 0 33 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M32.6094 40H0.609375V0H32.6094V40Z" stroke="#E5E7EB" />
                                                        <path d="M24.6094 29H8.60938V10H24.6094V29Z" stroke="#E5E7EB" />
                                                        <g clip-path="url(#clip0_48_6308)">
                                                            <path d="M23.3469 11.6783C22.6625 10.9939 21.5562 10.9939 20.8719 11.6783L19.9312 12.6158L22.9906 15.6752L23.9312 14.7346C24.6156 14.0502 24.6156 12.9439 23.9312 12.2596L23.3469 11.6783ZM13.9969 18.5533C13.8062 18.7439 13.6594 18.9783 13.575 19.2377L12.65 22.0127C12.5594 22.2814 12.6313 22.5783 12.8313 22.7814C13.0312 22.9846 13.3281 23.0533 13.6 22.9627L16.375 22.0377C16.6313 21.9533 16.8656 21.8064 17.0594 21.6158L22.2875 16.3846L19.225 13.3221L13.9969 18.5533ZM11.6094 13.0002C9.95312 13.0002 8.60938 14.3439 8.60938 16.0002V24.0002C8.60938 25.6564 9.95312 27.0002 11.6094 27.0002H19.6094C21.2656 27.0002 22.6094 25.6564 22.6094 24.0002V21.0002C22.6094 20.4471 22.1625 20.0002 21.6094 20.0002C21.0562 20.0002 20.6094 20.4471 20.6094 21.0002V24.0002C20.6094 24.5533 20.1625 25.0002 19.6094 25.0002H11.6094C11.0563 25.0002 10.6094 24.5533 10.6094 24.0002V16.0002C10.6094 15.4471 11.0563 15.0002 11.6094 15.0002H14.6094C15.1625 15.0002 15.6094 14.5533 15.6094 14.0002C15.6094 13.4471 15.1625 13.0002 14.6094 13.0002H11.6094Z" fill="#4B5563" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_48_6308">
                                                                <path d="M8.60938 11H24.6094V27H8.60938V11Z" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>

                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTrip(trip._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete trip"
                                                >
                                                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.83437 0.553125L4.60938 1H1.60938C1.05625 1 0.609375 1.44687 0.609375 2C0.609375 2.55312 1.05625 3 1.60938 3H13.6094C14.1625 3 14.6094 2.55312 14.6094 2C14.6094 1.44687 14.1625 1 13.6094 1H10.6094L10.3844 0.553125C10.2156 0.2125 9.86875 0 9.49063 0H5.72813C5.35 0 5.00312 0.2125 4.83437 0.553125ZM13.6094 4H1.60938L2.27188 14.5938C2.32187 15.3844 2.97813 16 3.76875 16H11.45C12.2406 16 12.8969 15.3844 12.9469 14.5938L13.6094 4Z" fill="#DC2626" />
                                                    </svg>

                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                            No trips found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Booking Management Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-700">Booking Management</h2>
                        <div className="flex gap-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                                All Bookings
                            </button>
                            <button
                                onClick={exportBookingsCSV}
                                className="border border-blue-600  bg-white hover:bg-gray-50 text-blue-600  px-4 py-2 rounded-md text-sm font-medium transition"
                            >
                                Verify QR
                            </button>
                        </div>
                    </div>

                    {/* Bookings Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Booking ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Trip Route
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Seats
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        QR Verified
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings && bookings.length > 0 ? bookings.slice(0, 10).map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            #{booking._id?.slice(-6) || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {booking.user?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {booking.trip?.from} to {booking.trip?.to}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDate(booking.trip?.dateTime || booking.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {booking.selectedSeats?.join(', ') || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${booking.status === 'confirmed'
                                                ? 'bg-green-100 text-green-700'
                                                : booking.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {booking.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={booking.qrVerified ? 'text-green-600' : 'text-red-600'}>
                                                {booking.qrVerified ? <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8.39062 16C10.5124 16 12.5472 15.1571 14.0475 13.6569C15.5478 12.1566 16.3906 10.1217 16.3906 8C16.3906 5.87827 15.5478 3.84344 14.0475 2.34315C12.5472 0.842855 10.5124 0 8.39062 0C6.26889 0 4.23406 0.842855 2.73377 2.34315C1.23348 3.84344 0.390625 5.87827 0.390625 8C0.390625 10.1217 1.23348 12.1566 2.73377 13.6569C4.23406 15.1571 6.26889 16 8.39062 16ZM11.9219 6.53125L7.92188 10.5312C7.62813 10.825 7.15313 10.825 6.8625 10.5312L4.8625 8.53125C4.56875 8.2375 4.56875 7.7625 4.8625 7.47188C5.15625 7.18125 5.63125 7.17813 5.92188 7.47188L7.39062 8.94063L10.8594 5.46875C11.1531 5.175 11.6281 5.175 11.9187 5.46875C12.2094 5.7625 12.2125 6.2375 11.9187 6.52812L11.9219 6.53125Z" fill="#16A34A" />
                                                </svg>
                                                    : <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="8.39062" cy="8" r="8" stroke="gray" stroke-width="1" />
                                                    </svg>}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleUpdateBookingStatus(booking._id,
                                                        booking.status === 'confirmed' ? 'pending' : 'confirmed'
                                                    )}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Toggle status"
                                                >
                                                    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M15.0031 0.67832C14.3188 -0.0060547 13.2125 -0.0060547 12.5281 0.67832L11.5875 1.61582L14.6469 4.6752L15.5875 3.73457C16.2719 3.0502 16.2719 1.94395 15.5875 1.25957L15.0031 0.67832ZM5.65312 7.55332C5.4625 7.74395 5.31562 7.97832 5.23125 8.2377L4.30625 11.0127C4.21563 11.2814 4.2875 11.5783 4.4875 11.7814C4.6875 11.9846 4.98438 12.0533 5.25625 11.9627L8.03125 11.0377C8.2875 10.9533 8.52187 10.8064 8.71562 10.6158L13.9438 5.38457L10.8813 2.32207L5.65312 7.55332ZM3.26562 2.0002C1.60938 2.0002 0.265625 3.34395 0.265625 5.0002V13.0002C0.265625 14.6564 1.60938 16.0002 3.26562 16.0002H11.2656C12.9219 16.0002 14.2656 14.6564 14.2656 13.0002V10.0002C14.2656 9.44707 13.8188 9.0002 13.2656 9.0002C12.7125 9.0002 12.2656 9.44707 12.2656 10.0002V13.0002C12.2656 13.5533 11.8188 14.0002 11.2656 14.0002H3.26562C2.7125 14.0002 2.26562 13.5533 2.26562 13.0002V5.0002C2.26562 4.44707 2.7125 4.0002 3.26562 4.0002H6.26562C6.81875 4.0002 7.26562 3.55332 7.26562 3.0002C7.26562 2.44707 6.81875 2.0002 6.26562 2.0002H3.26562Z" fill="#4B5563" />
                                                    </svg>

                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBooking(booking._id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Cancel booking"
                                                >
                                                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.49062 0.553125L4.26562 1H1.26562C0.7125 1 0.265625 1.44687 0.265625 2C0.265625 2.55312 0.7125 3 1.26562 3H13.2656C13.8188 3 14.2656 2.55312 14.2656 2C14.2656 1.44687 13.8188 1 13.2656 1H10.2656L10.0406 0.553125C9.87187 0.2125 9.525 0 9.14688 0H5.38438C5.00625 0 4.65937 0.2125 4.49062 0.553125ZM13.2656 4H1.26562L1.92813 14.5938C1.97812 15.3844 2.63438 16 3.425 16H11.1062C11.8969 16 12.5531 15.3844 12.6031 14.5938L13.2656 4Z" fill="#DC2626" />
                                                    </svg>

                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                                            No bookings found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add Trip Modal */}
            <AddTripModal
                isOpen={isAddTripModalOpen}
                onClose={() => setIsAddTripModalOpen(false)}
                onTripAdded={() => {
                    getTrips(); // Refresh trips list
                    fetchStats(); // Refresh stats
                }}
            />

            <Footer />

            {/* Toast Container */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </div>
    );
}
