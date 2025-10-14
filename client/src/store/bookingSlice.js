import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBookings, getBookingById, createBooking, updateBooking, cancelBooking, getUserBookings } from '../api/bookings.api';

// Async thunks for booking operations
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await getBookings(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await getBookingById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking');
    }
  }
);

export const addBooking = createAsyncThunk(
  'bookings/addBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const { data } = await createBooking(bookingData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const editBooking = createAsyncThunk(
  'bookings/editBooking',
  async ({ id, bookingData }, { rejectWithValue }) => {
    try {
      const { data } = await updateBooking(id, bookingData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking');
    }
  }
);

export const removeBooking = createAsyncThunk(
  'bookings/removeBooking',
  async (id, { rejectWithValue }) => {
    try {
      await cancelBooking(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await getUserBookings(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user bookings');
    }
  }
);
const initialState = {
  bookings: [],
  userBookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearUserBookings: (state) => {
      state.userBookings = [];
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings || action.payload;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch booking by ID
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.booking || action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add booking
      .addCase(addBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.loading = false;
        const newBooking = action.payload.booking || action.payload;
        state.bookings.unshift(newBooking);
        state.userBookings.unshift(newBooking);
      })
      .addCase(addBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit booking
      .addCase(editBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editBooking.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBooking = action.payload.booking || action.payload;
        
        // Update in bookings array
        const bookingIndex = state.bookings.findIndex(booking => booking.id === updatedBooking.id);
        if (bookingIndex !== -1) {
          state.bookings[bookingIndex] = updatedBooking;
        }
        
        // Update in userBookings array
        const userBookingIndex = state.userBookings.findIndex(booking => booking.id === updatedBooking.id);
        if (userBookingIndex !== -1) {
          state.userBookings[userBookingIndex] = updatedBooking;
        }
        
        // Update current booking
        if (state.currentBooking?.id === updatedBooking.id) {
          state.currentBooking = updatedBooking;
        }
      })
      .addCase(editBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove booking
      .addCase(removeBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeBooking.fulfilled, (state, action) => {
        state.loading = false;
        const bookingId = action.payload;
        state.bookings = state.bookings.filter(booking => booking.id !== bookingId);
        state.userBookings = state.userBookings.filter(booking => booking.id !== bookingId);
        if (state.currentBooking?.id === bookingId) {
          state.currentBooking = null;
        }
      })
      .addCase(removeBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.userBookings = action.payload.bookings || action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentBooking, clearUserBookings, setCurrentPage } = bookingSlice.actions;
export default bookingSlice.reducer;