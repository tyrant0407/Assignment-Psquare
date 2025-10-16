import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { usePayments } from '../../hooks/usePayments';
import { useAuth } from '../../hooks/useAuth';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { makePayment, loading, error } = usePayments();

    // Get booking data from navigation state
    const { bookingId, trip, selectedSeats, totalAmount } = location.state || {};
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phonenumber: '',
        paymentMethod: 'dummy',
        cardNumber: '4111111111111111',
        cardHolder: '',
        expiryMonth: '12',
        expiryYear: '2025',
        cvv: '123'
    });

    useEffect(() => {
        console.log('PaymentPage - Checking booking data:', { bookingId, trip, selectedSeats });

        // Redirect if no booking data
        if (!bookingId || !trip || !selectedSeats || selectedSeats.length === 0) {
            console.log('PaymentPage - Missing booking data, redirecting to home');
            navigate('/');
            return;
        }
    }, [bookingId, trip, selectedSeats, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePaymentMethodChange = (method) => {
        setFormData(prev => ({
            ...prev,
            paymentMethod: method
        }));
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

    const handleCompletePayment = async () => {
        if (!bookingId) {
            alert('Booking not created yet. Please wait...');
            return;
        }

        try {
            // Prepare payment data according to your required format
            const paymentData = {
                bookingId: bookingId,
                paymentMethod: formData.paymentMethod,
                cardNumber: formData.cardNumber,
                cardHolder: formData.cardHolder,
                expiryMonth: formData.expiryMonth,
                expiryYear: formData.expiryYear,
                cvv: formData.cvv,
                name: formData.name,
                email: formData.email,
                phonenumber: formData.phonenumber
            };

            const result = await makePayment(paymentData);

            // Handle successful payment
            navigate('/payment/confirmation', {
                state: {
                    bookingData: {
                        bookingId: bookingId,
                        trip: {
                            origin: trip.from,
                            destination: trip.to,
                            originCity: trip.from,
                            destinationCity: trip.to,
                            departureTime: formatTime(trip.dateTime),
                            arrivalTime: formatTime(new Date(new Date(trip.dateTime).getTime() + 2.5 * 60 * 60 * 1000)), // Add 2.5 hours
                            date: formatDate(trip.dateTime),
                            duration: '2h 30min'
                        },
                        selectedSeats: selectedSeats,
                        totalAmount: totalAmount,
                        paymentMethod: formData.paymentMethod
                    }
                }
            });

        } catch (err) {
            console.error('Payment failed:', err);
        }
    };

    if (!bookingId || !trip || !selectedSeats) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <div className="text-lg">Loading...</div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout & Payment</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - User Information & Payment */}
                    <div className="space-y-8">
                        {/* Your Information */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-2">Your Information</h2>
                            <p className="text-gray-600 text-sm mb-6">Please provide your contact details for this booking</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="John Smith"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="johnsmith234@gmail.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phonenumber"
                                        value={formData.phonenumber}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                            <div className="space-y-4 mb-6">
                                <div
                                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.paymentMethod === 'dummy' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                        }`}
                                    onClick={() => handlePaymentMethodChange('dummy')}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="dummy"
                                        checked={formData.paymentMethod === 'dummy'}
                                        onChange={() => handlePaymentMethodChange('dummy')}
                                        className="mr-3"
                                    />
                                    <div className="flex items-center">
                                        <div className="w-8 h-6 bg-blue-600 rounded mr-2 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v4H4v-4z" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">Credit or Debit Card</span>
                                    </div>
                                </div>

                                <div
                                    className={`flex items-center p-4 border rounded-lg cursor-pointer ${formData.paymentMethod === 'wallet' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                        }`}
                                    onClick={() => handlePaymentMethodChange('wallet')}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="wallet"
                                        checked={formData.paymentMethod === 'wallet'}
                                        onChange={() => handlePaymentMethodChange('wallet')}
                                        className="mr-3"
                                    />
                                    <div className="flex items-center">
                                        <div className="w-8 h-6 bg-purple-600 rounded mr-2 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" />
                                            </svg>
                                        </div>
                                        <span className="font-medium">Digital Wallet (e.g., PayPal, Apple Pay)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Details */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="•••• •••• •••• 1234"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                                    <input
                                        type="text"
                                        name="cardHolder"
                                        value={formData.cardHolder}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="John Smith"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Month</label>
                                        <input
                                            type="text"
                                            name="expiryMonth"
                                            value={formData.expiryMonth}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="12"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Year</label>
                                        <input
                                            type="text"
                                            name="expiryYear"
                                            value={formData.expiryYear}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="2025"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="123"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Summary */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>

                        {/* Trip Image */}
                        <div className="mb-6">
                            <div className="w-full h-40 bg-gray-800 rounded-lg flex items-center justify-center">
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        {/* Trip Details */}
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">Route:</span>
                                </div>
                                <span className="font-medium">{trip.from} to {trip.to}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">Date:</span>
                                </div>
                                <span className="font-medium">{formatDate(trip.dateTime)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">Time:</span>
                                </div>
                                <span className="font-medium">{formatTime(trip.dateTime)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">Transport:</span>
                                </div>
                                <span className="font-medium">Flight</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                                    <span className="text-sm text-gray-600">Seats:</span>
                                </div>
                                <span className="font-medium">{selectedSeats.join(', ')}</span>
                            </div>
                        </div>

                        {/* Total Fare */}
                        <div className="border-t pt-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Total Fare:</span>
                                <span className="text-2xl font-bold text-blue-600">USD {totalAmount}.00</span>
                            </div>
                        </div>

                        {/* Complete Payment Button */}
                        <button
                            onClick={handleCompletePayment}
                            disabled={loading || !bookingId}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${loading || !bookingId
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {loading ? 'Processing...' : 'Complete Payment'}
                        </button>

                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PaymentPage;