import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
    fetchBookings,
    fetchBookingById,
    addBooking,
    editBooking,
    removeBooking,
    fetchUserBookings,
    clearError,
    clearCurrentBooking,
    clearUserBookings,
    setCurrentPage
} from '../store/bookingSlice';

/**
 * Custom hook for booking operations
 * Provides booking state and methods for CRUD operations
 */
export const useBookings = () => {
    const dispatch = useDispatch();
    const {
        bookings,
        userBookings,
        currentBooking,
        loading,
        error,
        totalPages,
        currentPage
    } = useSelector((state) => state.bookings);

    const getBookings = useCallback(async (params = {}) => {
        const result = await dispatch(fetchBookings(params));
        return result.type === 'bookings/fetchBookings/fulfilled';
    }, [dispatch]);

    const getBookingById = useCallback(async (id) => {
        const result = await dispatch(fetchBookingById(id));
        return result.type === 'bookings/fetchBookingById/fulfilled';
    }, [dispatch]);

    const createBooking = useCallback(async (bookingData) => {
        const result = await dispatch(addBooking(bookingData));
        if (result.type === 'bookings/addBooking/fulfilled') {
            return result.payload; // Return the actual booking data
        }
        return null;
    }, [dispatch]);

    const updateBooking = useCallback(async (id, bookingData) => {
        const result = await dispatch(editBooking({ id, bookingData }));
        return result.type === 'bookings/editBooking/fulfilled';
    }, [dispatch]);

    const cancelBooking = useCallback(async (id) => {
        const result = await dispatch(removeBooking(id));
        return result.type === 'bookings/removeBooking/fulfilled';
    }, [dispatch]);

    const getUserBookings = useCallback(async (userId) => {
        const result = await dispatch(fetchUserBookings(userId));
        return result.type === 'bookings/fetchUserBookings/fulfilled';
    }, [dispatch]);

    const clearBookingError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const clearCurrentBookingData = useCallback(() => {
        dispatch(clearCurrentBooking());
    }, [dispatch]);

    const clearUserBookingData = useCallback(() => {
        dispatch(clearUserBookings());
    }, [dispatch]);

    const setPage = useCallback((page) => {
        dispatch(setCurrentPage(page));
    }, [dispatch]);

    return {
        // State
        bookings,
        userBookings,
        currentBooking,
        loading,
        error,
        totalPages,
        currentPage,

        // Actions
        getBookings,
        getBookingById,
        createBooking,
        updateBooking,
        cancelBooking,
        getUserBookings,
        clearBookingError,
        clearCurrentBookingData,
        clearUserBookingData,
        setPage,

        // Computed values
        hasBookings: bookings.length > 0,
        hasUserBookings: userBookings.length > 0,
        isLoadingBookings: loading,
    };
};

export default useBookings;