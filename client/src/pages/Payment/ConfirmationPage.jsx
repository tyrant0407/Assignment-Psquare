import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar'
import Footer from '../../components/layout/Footer'
import DownloadToast from '../../components/ui/DownloadToast';

const ConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState(null);
    const [showDownloadToast, setShowDownloadToast] = useState(false);

    useEffect(() => {
        // Get booking data from location state or redirect if not available
        if (location.state?.bookingData) {
            setBookingData(location.state.bookingData);
        } else {
            // If no booking data, redirect to home
            navigate('/');
        }
    }, [location.state, navigate]);

    const handleDownloadTicket = () => {
        // Implement ticket download functionality
        console.log('Downloading ticket...');

        // Show download toast
        setShowDownloadToast(true);

        // Simulate download
        const element = document.createElement('a');
        const file = new Blob(['Ticket Data - ' + JSON.stringify(bookingData, null, 2)], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `ticket-${bookingData?.bookingId || 'download'}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleViewTicket = () => {
        // Navigate to ticket view page with booking data
        navigate('/ticket/view', {
            state: {
                ticketData: {
                    bookingId: bookingData.bookingId,
                    passengerName: bookingData.passengerName || 'James Doe',
                    airline: 'Emirates A380 Airbus',
                    location: 'Guwahayou Mall, Indro Chail, New, Istanbul 34437',
                    totalAmount: bookingData.totalAmount,
                    class: 'Business Class',
                    date: bookingData.trip?.date,
                    duration: bookingData.trip?.duration,
                    gate: 'A22',
                    seats: bookingData.selectedSeats?.join(', '),
                    departureTime: bookingData.trip?.departureTime,
                    arrivalTime: bookingData.trip?.arrivalTime,
                    origin: bookingData.trip?.originCity,
                    destination: bookingData.trip?.destinationCity
                }
            }
        });
    };

    if (!bookingData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⏳</div>
                    <p className="text-gray-600">Loading confirmation...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 ">
            <Navbar />
            <div className="max-w-xl mx-auto">

                {/* Success Icon and Header */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 mt-4">
                        <span className="text-xl">
                            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32C0 14.3269 14.3269 0 32 0Z" fill="#DCFCE7" />
                                <path d="M32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 0 49.6731 0 32C0 14.3269 14.3269 0 32 0Z" stroke="#E5E7EB" />
                                <path d="M42.5 48H21.5V16H42.5V48Z" stroke="#E5E7EB" />
                                <g clip-path="url(#clip0_1_45892)">
                                    <path d="M42.059 23.9406C42.6449 24.5266 42.6449 25.4781 42.059 26.0641L30.059 38.0641C29.473 38.65 28.5215 38.65 27.9355 38.0641L21.9355 32.0641C21.3496 31.4781 21.3496 30.5266 21.9355 29.9406C22.5215 29.3547 23.473 29.3547 24.059 29.9406L28.9996 34.8766L39.9402 23.9406C40.5262 23.3547 41.4777 23.3547 42.0637 23.9406H42.059Z" fill="#16A34A" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1_45892">
                                        <path d="M21.5 19H42.5V43H21.5V19Z" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-600">Your trip is successfully booked. Enjoy your journey!</p>
                </div>

                {/* Ticket Card */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-5">
                    {/* Ticket Header */}
                    <div className="bg-blue-600 text-white p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">Flight Ticket</h2>
                                <p className="text-blue-100 text-sm">Booking ID: #{bookingData.bookingId || 'TRV123456'}</p>
                            </div>
                            <span className="text-2xl">
                                <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.6078 9C24.2109 9 27 10.3594 27 12C27 13.6875 24.2109 15 22.6078 15H17.1422L12.4313 23.2453C12.1641 23.7141 11.6672 24 11.1281 24H8.49375C7.99687 24 7.63594 23.5219 7.77188 23.0438L10.0688 15H5.25L3.225 17.7C3.08438 17.8875 2.85938 18 2.625 18H0.65625C0.290625 18 0 17.7047 0 17.3438C0 17.2828 0.009375 17.2219 0.0234375 17.1609L1.5 12L0.0234375 6.83906C0.0046875 6.77812 0 6.71719 0 6.65625C0 6.29063 0.295313 6 0.65625 6H2.625C2.85938 6 3.08438 6.1125 3.225 6.3L5.25 9H10.0734L7.77656 0.95625C7.63594 0.478125 7.99687 0 8.49375 0H11.1281C11.6672 0 12.1641 0.290625 12.4313 0.754688L17.1422 9H22.6078Z" fill="white" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* Route Information */}
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {bookingData.trip?.origin || 'LAX'}
                                </h3>
                                <p className="text-gray-500 text-xs">
                                    {bookingData.trip?.originCity || 'Los Angeles'}
                                </p>
                                <p className="text-gray-900 font-medium text-sm">
                                    {bookingData.trip?.departureTime || '09:30 AM'}
                                </p>
                            </div>

                            <div className="flex-1 flex items-center justify-center px-3">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                                    <span className="text-blue-600 text-lg">✈️</span>
                                    <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>
                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                </div>
                                <div className="absolute bg-white px-2 text-xs text-gray-500">
                                    {bookingData.trip?.duration || '2h 30min'}
                                </div>
                            </div>

                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {bookingData.trip?.destination || 'SFO'}
                                </h3>
                                <p className="text-gray-500 text-xs">
                                    {bookingData.trip?.destinationCity || 'San Francisco'}
                                </p>
                                <p className="text-gray-900 font-medium text-sm">
                                    {bookingData.trip?.arrivalTime || '12:00 PM'}
                                </p>
                            </div>
                        </div>

                        {/* Trip Details */}
                        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-gray-500 text-xs">Date</p>
                                <p className="font-medium text-sm">
                                    {bookingData.trip?.date || 'October 26, 2024'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">Seats</p>
                                <p className="font-medium text-sm">
                                    {bookingData.selectedSeats?.join(', ') || 'E5, E6'}
                                </p>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="flex justify-between items-center mb-4 p-3 border-t border-gray-200">
                            <span className="text-base font-medium text-gray-900">Total Fare Paid</span>
                            <span className="text-xl font-bold text-green-600">
                                ${bookingData.totalAmount || '96.00'}
                            </span>
                        </div>

                        {/* QR Code Section */}
                        <div className="text-center mb-4">
                            <div className="inline-block p-3 bg-gray-100 rounded-lg">
                                <div className="w-20 h-20 bg-gray-300 rounded flex items-center justify-center text-3xl">
                                    📱
                                </div>
                            </div>
                            <p className="text-gray-500 text-xs mt-2">Scan this QR code at the boarding gate</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleDownloadTicket}
                                className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <span><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 1C9 0.446875 8.55313 0 8 0C7.44688 0 7 0.446875 7 1V8.58438L4.70625 6.29063C4.31563 5.9 3.68125 5.9 3.29063 6.29063C2.9 6.68125 2.9 7.31563 3.29063 7.70625L7.29063 11.7063C7.68125 12.0969 8.31563 12.0969 8.70625 11.7063L12.7063 7.70625C13.0969 7.31563 13.0969 6.68125 12.7063 6.29063C12.3156 5.9 11.6812 5.9 11.2906 6.29063L9 8.58438V1ZM2 11C0.896875 11 0 11.8969 0 13V14C0 15.1031 0.896875 16 2 16H14C15.1031 16 16 15.1031 16 14V13C16 11.8969 15.1031 11 14 11H10.8281L9.4125 12.4156C8.63125 13.1969 7.36562 13.1969 6.58437 12.4156L5.17188 11H2ZM13.5 12.75C13.6989 12.75 13.8897 12.829 14.0303 12.9697C14.171 13.1103 14.25 13.3011 14.25 13.5C14.25 13.6989 14.171 13.8897 14.0303 14.0303C13.8897 14.171 13.6989 14.25 13.5 14.25C13.3011 14.25 13.1103 14.171 12.9697 14.0303C12.829 13.8897 12.75 13.6989 12.75 13.5C12.75 13.3011 12.829 13.1103 12.9697 12.9697C13.1103 12.829 13.3011 12.75 13.5 12.75Z" fill="white" />
                                </svg>
                                </span>
                                Download Ticket
                            </button>
                            <button
                                onClick={handleViewTicket}
                                className="flex-1 border border-blue-600 text-blue-600 py-2.5 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <span><svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.0002 0C6.4752 0 4.45332 1.15 2.98145 2.51875C1.51895 3.875 0.54082 5.5 0.0783203 6.61562C-0.0248047 6.8625 -0.0248047 7.1375 0.0783203 7.38437C0.54082 8.5 1.51895 10.125 2.98145 11.4812C4.45332 12.85 6.4752 14 9.0002 14C11.5252 14 13.5471 12.85 15.0189 11.4812C16.4814 10.1219 17.4596 8.5 17.9252 7.38437C18.0283 7.1375 18.0283 6.8625 17.9252 6.61562C17.4596 5.5 16.4814 3.875 15.0189 2.51875C13.5471 1.15 11.5252 0 9.0002 0ZM4.5002 7C4.5002 5.80653 4.9743 4.66193 5.81821 3.81802C6.66213 2.97411 7.80672 2.5 9.0002 2.5C10.1937 2.5 11.3383 2.97411 12.1822 3.81802C13.0261 4.66193 13.5002 5.80653 13.5002 7C13.5002 8.19347 13.0261 9.33807 12.1822 10.182C11.3383 11.0259 10.1937 11.5 9.0002 11.5C7.80672 11.5 6.66213 11.0259 5.81821 10.182C4.9743 9.33807 4.5002 8.19347 4.5002 7ZM9.0002 5C9.0002 6.10313 8.10332 7 7.0002 7C6.77832 7 6.56582 6.9625 6.36582 6.89687C6.19395 6.84062 5.99395 6.94688 6.0002 7.12813C6.00957 7.34375 6.04082 7.55937 6.1002 7.775C6.52832 9.375 8.17519 10.325 9.7752 9.89688C11.3752 9.46875 12.3252 7.82188 11.8971 6.22188C11.5502 4.925 10.4033 4.05312 9.12832 4C8.94707 3.99375 8.84082 4.19062 8.89707 4.36562C8.9627 4.56562 9.0002 4.77812 9.0002 5Z" fill="#2563EB" />
                                </svg>
                                </span>
                                View Ticket
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Additional Navigation */}
            <div className="text-center space-y-4 py-8">
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        🏠 Back to Home
                    </button>
                    <button
                        onClick={() => navigate('/bookings')}
                        className="text-blue-600 hover:text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        📋 My Bookings
                    </button>
                </div>

                <div className="text-sm text-gray-500">
                    <p>Need help? Contact our support team</p>
                    <p className="flex items-center justify-center gap-1 mt-1">
                        <span>📧</span>
                        support@argo.com
                    </p>
                </div>
            </div>

            <Footer />

            {/* Download Toast */}
            {showDownloadToast && (
                <DownloadToast onClose={() => setShowDownloadToast(false)} />
            )}
        </div>
    );
};

export default ConfirmationPage;