import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { 
  fetchTrips, 
  fetchTripById, 
  addTrip, 
  editTrip, 
  removeTrip, 
  searchForTrips,
  clearError,
  clearCurrentTrip,
  clearSearchResults,
  setCurrentPage
} from '../store/tripSlice';

/**
 * Custom hook for trip operations
 * Provides trip state and methods for CRUD operations
 */
export const useTrips = () => {
  const dispatch = useDispatch();
  const { 
    trips, 
    currentTrip, 
    searchResults, 
    loading, 
    error, 
    totalPages, 
    currentPage 
  } = useSelector((state) => state.trips);

  const getTrips = useCallback(async (params = {}) => {
    const result = await dispatch(fetchTrips(params));
    return result.type === 'trips/fetchTrips/fulfilled';
  }, [dispatch]);

  const getTripById = useCallback(async (id) => {
    const result = await dispatch(fetchTripById(id));
    return result.type === 'trips/fetchTripById/fulfilled';
  }, [dispatch]);

  const createTrip = useCallback(async (tripData) => {
    const result = await dispatch(addTrip(tripData));
    return result.type === 'trips/addTrip/fulfilled';
  }, [dispatch]);

  const updateTrip = useCallback(async (id, tripData) => {
    const result = await dispatch(editTrip({ id, tripData }));
    return result.type === 'trips/editTrip/fulfilled';
  }, [dispatch]);

  const deleteTrip = useCallback(async (id) => {
    const result = await dispatch(removeTrip(id));
    return result.type === 'trips/removeTrip/fulfilled';
  }, [dispatch]);

  const searchTrips = useCallback(async (searchParams) => {
    const result = await dispatch(searchForTrips(searchParams));
    return result.type === 'trips/searchForTrips/fulfilled';
  }, [dispatch]);

  const clearTripError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearCurrentTripData = useCallback(() => {
    dispatch(clearCurrentTrip());
  }, [dispatch]);

  const clearTripSearchResults = useCallback(() => {
    dispatch(clearSearchResults());
  }, [dispatch]);

  const setPage = useCallback((page) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  return {
    // State
    trips,
    currentTrip,
    searchResults,
    loading,
    error,
    totalPages,
    currentPage,
    
    // Actions
    getTrips,
    getTripById,
    createTrip,
    updateTrip,
    deleteTrip,
    searchTrips,
    clearTripError,
    clearCurrentTripData,
    clearTripSearchResults,
    setPage,
    
    // Computed values
    hasTrips: trips.length > 0,
    hasSearchResults: searchResults.length > 0,
    isLoadingTrips: loading,
  };
};

export default useTrips;