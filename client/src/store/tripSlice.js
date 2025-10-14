import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrips, getTripById, createTrip, updateTrip, deleteTrip, searchTrips } from '../api/trips.api';

// Async thunks for trip operations
export const fetchTrips = createAsyncThunk(
  'trips/fetchTrips',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await getTrips(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trips');
    }
  }
);

export const fetchTripById = createAsyncThunk(
  'trips/fetchTripById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await getTripById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trip');
    }
  }
);

export const addTrip = createAsyncThunk(
  'trips/addTrip',
  async (tripData, { rejectWithValue }) => {
    try {
      const { data } = await createTrip(tripData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create trip');
    }
  }
);

export const editTrip = createAsyncThunk(
  'trips/editTrip',
  async ({ id, tripData }, { rejectWithValue }) => {
    try {
      const { data } = await updateTrip(id, tripData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update trip');
    }
  }
);

export const removeTrip = createAsyncThunk(
  'trips/removeTrip',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTrip(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete trip');
    }
  }
);

export const searchForTrips = createAsyncThunk(
  'trips/searchForTrips',
  async (searchParams, { rejectWithValue }) => {
    try {
      const { data } = await searchTrips(searchParams);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search trips');
    }
  }
);

const initialState = {
  trips: [],
  currentTrip: null,
  searchResults: [],
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
};

const tripSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentTrip: (state) => {
      state.currentTrip = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch trips
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both direct array and wrapped response
        const responseData = action.payload.data || action.payload;
        state.trips = Array.isArray(responseData) ? responseData : (responseData.trips || []);
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch trip by ID
      .addCase(fetchTripById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrip = action.payload.data || action.payload.trip || action.payload;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add trip
      .addCase(addTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips.unshift(action.payload.data || action.payload.trip || action.payload);
      })
      .addCase(addTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit trip
      .addCase(editTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTrip.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTrip = action.payload.data || action.payload.trip || action.payload;
        const index = state.trips.findIndex(trip => trip.id === updatedTrip.id);
        if (index !== -1) {
          state.trips[index] = updatedTrip;
        }
        if (state.currentTrip?.id === updatedTrip.id) {
          state.currentTrip = updatedTrip;
        }
      })
      .addCase(editTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove trip
      .addCase(removeTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = state.trips.filter(trip => trip.id !== action.payload);
        if (state.currentTrip?.id === action.payload) {
          state.currentTrip = null;
        }
      })
      .addCase(removeTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search trips
      .addCase(searchForTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchForTrips.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both direct array and wrapped response
        const responseData = action.payload.data || action.payload;
        state.searchResults = Array.isArray(responseData) ? responseData : (responseData.trips || []);
      })
      .addCase(searchForTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentTrip, clearSearchResults, setCurrentPage } = tripSlice.actions;
export default tripSlice.reducer;