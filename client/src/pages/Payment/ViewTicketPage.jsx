import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DownloadToast from '../../components/ui/DownloadToast';

export default function ViewTicketPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [ticketData, setTicketData] = useState(null);
    const [showDownloadToast, setShowDownloadToast] = useState(false);

    useEffect(() => {
        // Get ticket data from location state or redirect if not available
        if (location.state?.ticketData) {
            setTicketData(location.state.ticketData);
        } else {
            // If no ticket data, redirect to bookings
            navigate('/bookings');
        }
    }, [location.state, navigate]);

    const handleDownload = () => {
        // Implement ticket download functionality
        console.log('Downloading ticket...');

        // Show download toast
        setShowDownloadToast(true);

        // You can implement PDF generation or other download logic here
        // For now, we'll simulate a download
        const element = document.createElement('a');
        const file = new Blob(['Ticket Data - ' + JSON.stringify(ticketData, null, 2)], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `ticket-${ticketData?.bookingId || 'download'}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    if (!ticketData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">

                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">⏳</div>
                    <p className="text-gray-600">Loading ticket...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  bg-white-50 ">
            <Navbar />
            <div className="max-w-6xl mx-auto mt-1.5">

                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {ticketData.airline || 'Emirates A380 Airbus'}
                            </h1>
                            <div className="flex items-center text-gray-600 text-sm">
                                <span className="mr-2">📍</span>
                                <span>{ticketData.location || 'Guwahayou Mall, Indro Chail, New, Istanbul 34437'}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                ${ticketData.totalAmount || '96'}
                            </div>
                            <button
                                onClick={handleDownload}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition"
                            >
                                Download
                            </button>
                        </div>
                    </div>

                    {/* Booking Card */}
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-6">
                        {/* Passenger Info */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center text-2xl mr-3">
                                    👤
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {ticketData.passengerName || 'James Doe'}
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        Boarding Pass N°{ticketData.bookingId || '123'}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm font-medium">
                                {ticketData.class || 'Business Class'}
                            </div>
                        </div>

                        {/* Flight Details Grid */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            <div className="bg-white bg-opacity-70 rounded-lg p-3">
                                <div className="flex items-center text-blue-600 text-sm mb-1">
                                    <span className="mr-1">📅</span>
                                    <span className="font-medium">Date</span>
                                </div>
                                <div className="text-gray-900 font-semibold">
                                    {ticketData.date || '24 Oct 2024'}
                                </div>
                            </div>
                            <div className="bg-white bg-opacity-70 rounded-lg p-3">
                                <div className="flex items-center text-blue-600 text-sm mb-1">
                                    <span className="mr-1">⏰</span>
                                    <span className="font-medium">Flight Time</span>
                                </div>
                                <div className="text-gray-900 font-semibold">
                                    {ticketData.duration || '1h00'}
                                </div>
                            </div>
                            <div className="bg-white bg-opacity-70 rounded-lg p-3">
                                <div className="flex items-center text-blue-600 text-sm mb-1">
                                    <span className="mr-1">🚪</span>
                                    <span className="font-medium">Gate</span>
                                </div>
                                <div className="text-gray-900 font-semibold">
                                    {ticketData.gate || 'A22'}
                                </div>
                            </div>
                            <div className="bg-white bg-opacity-70 rounded-lg p-3">
                                <div className="flex items-center text-blue-600 text-sm mb-1">
                                    <span className="mr-1">💺</span>
                                    <span className="font-medium">Seat</span>
                                </div>
                                <div className="text-gray-900 font-semibold">
                                    {ticketData.seats || '14I'}
                                </div>
                            </div>
                        </div>

                        {/* Flight Route */}
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {ticketData.departureTime || '9:30 Am'}
                                </div>
                                <div className="text-sm text-gray-700">
                                    {ticketData.origin || 'New York'}
                                </div>
                                <div className="mt-4 text-gray-600">✈️</div>
                            </div>
                            <div className="flex-1 mx-8 relative">
                                <div className="border-t-2 border-dashed border-gray-400"></div>
                                <div className="absolute top-0 right-0 transform translate-y-[-50%]">
                                    <div className="bg-amber-900 text-white text-xs px-2 py-1 rounded">
                                        ✈️ {ticketData.passengerName || 'James Doe'}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-gray-900">
                                    {ticketData.arrivalTime || '12:00 pm'}
                                </div>
                                <div className="text-sm text-gray-700">
                                    {ticketData.destination || 'Boston'}
                                </div>
                                <div className="mt-4">
                                    <div className="text-2xl font-bold">EK</div>
                                    <div className="text-xs text-gray-600">A380-800</div>
                                </div>
                            </div>
                        </div>

                        {/* Barcode */}
                        <div className="mt-6 flex justify-center">
                            <div className="bg-white p-4 rounded-lg">
                                <svg width="200" height="60" viewBox="0 0 200 60">
                                    <rect x="0" y="0" width="4" height="60" fill="black" />
                                    <rect x="6" y="0" width="2" height="60" fill="black" />
                                    <rect x="10" y="0" width="6" height="60" fill="black" />
                                    <rect x="18" y="0" width="2" height="60" fill="black" />
                                    <rect x="22" y="0" width="4" height="60" fill="black" />
                                    <rect x="28" y="0" width="2" height="60" fill="black" />
                                    <rect x="32" y="0" width="6" height="60" fill="black" />
                                    <rect x="40" y="0" width="4" height="60" fill="black" />
                                    <rect x="46" y="0" width="2" height="60" fill="black" />
                                    <rect x="50" y="0" width="6" height="60" fill="black" />
                                    <rect x="58" y="0" width="2" height="60" fill="black" />
                                    <rect x="62" y="0" width="4" height="60" fill="black" />
                                    <rect x="68" y="0" width="6" height="60" fill="black" />
                                    <rect x="76" y="0" width="2" height="60" fill="black" />
                                    <rect x="80" y="0" width="4" height="60" fill="black" />
                                    <rect x="86" y="0" width="2" height="60" fill="black" />
                                    <rect x="90" y="0" width="6" height="60" fill="black" />
                                    <rect x="98" y="0" width="4" height="60" fill="black" />
                                    <rect x="104" y="0" width="2" height="60" fill="black" />
                                    <rect x="108" y="0" width="6" height="60" fill="black" />
                                    <rect x="116" y="0" width="2" height="60" fill="black" />
                                    <rect x="120" y="0" width="4" height="60" fill="black" />
                                    <rect x="126" y="0" width="6" height="60" fill="black" />
                                    <rect x="134" y="0" width="2" height="60" fill="black" />
                                    <rect x="138" y="0" width="4" height="60" fill="black" />
                                    <rect x="144" y="0" width="2" height="60" fill="black" />
                                    <rect x="148" y="0" width="6" height="60" fill="black" />
                                    <rect x="156" y="0" width="4" height="60" fill="black" />
                                    <rect x="162" y="0" width="2" height="60" fill="black" />
                                    <rect x="166" y="0" width="6" height="60" fill="black" />
                                    <rect x="174" y="0" width="2" height="60" fill="black" />
                                    <rect x="178" y="0" width="4" height="60" fill="black" />
                                    <rect x="184" y="0" width="2" height="60" fill="black" />
                                    <rect x="188" y="0" width="6" height="60" fill="black" />
                                    <rect x="196" y="0" width="4" height="60" fill="black" />
                                </svg>
                            </div>
                            {/* Flight Path Illustration */}
                            <div className="ml-8">
                                <svg width="150" height="80" viewBox="0 0 150 80">
                                    {/* Departure marker */}
                                    <rect x="10" y="10" width="20" height="15" fill="#92400e" rx="2" />
                                    <text x="20" y="22" fontSize="10" fill="white" textAnchor="middle">🏢</text>
                                    {/* Dotted path */}
                                    <path d="M 30 17 Q 75 40, 120 17" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                                    {/* Arrival marker */}
                                    <rect x="120" y="60" width="20" height="15" fill="#92400e" rx="2" />
                                    <text x="130" y="72" fontSize="10" fill="white" textAnchor="middle">🏢</text>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Terms and Conditions</h2>
                    <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Payments</h3>
                        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                            <p>- If you are purchasing your ticket using a debit or credit card via the Website, we will process these payments via the automated secure common payment gateway which are PCI DSS compliant.</p>
                            <p>- If you do not supply the correct card billing address and/or cardholder information, your booking will not be confirmed and the overall cost may increase. We reserve the right to cancel your booking if payment is declined for any reason. If you have supplied incorrect card information, it may become possible for fraud or other financial crimes to be committed against you. We will not be responsible for any losses of any nature or any inconvenience caused to you as a result of any fraud or other financial crime committed against you or other losses of any nature that occur in such circumstances.</p>
                            <p>- Argo requires the card holder to provide additional verification upon request via either submitting an online form or visiting the nearest Argo Office, or at the discretion of Argo Group QSC, we may submit the booking and complete the purchase but the itinerary will be considered incomplete and if the card verification cannot be completed by the cardholder at check-in or when collecting the tickets, or in the case the original payment has been initiated or disputed by the card issuing bank. Credit card details are held in a secure environment and transferred through an internationally-accepted system.</p>
                        </div>
                    </div>
                </div>

                {/* Contact Us */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
                    <div className="text-sm text-gray-700 space-y-1">
                        <p>If you have any questions about our Website or our Terms of Use, please contact:</p>
                        <p className="font-semibold">Argo Group QSC</p>
                        <p>Barwa Tower,</p>
                        <p>P.O. Box: 22550</p>
                        <p>Doha, State of Qatar</p>
                        <p>Further contact details can be found at{' '}
                            <a href="mailto:argo@om?help" className="text-blue-600 hover:underline">argo@om?help</a>
                        </p>
                    </div>
                </div>

                {/* Footer Links */}

                {/* Back Button */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        ← Back to Previous Page
                    </button>
                </div>
            </div>
            <Footer />

            {/* Download Toast */}
            {showDownloadToast && (
                <DownloadToast onClose={() => setShowDownloadToast(false)} />
            )}
        </div>
    );
}