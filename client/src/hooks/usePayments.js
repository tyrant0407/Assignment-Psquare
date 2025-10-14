import { useState } from 'react';
import { processPayment } from '../api/payments.api';

export const usePayments = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const makePayment = async (paymentData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await processPayment(paymentData);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Payment failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        makePayment,
        loading,
        error
    };
};