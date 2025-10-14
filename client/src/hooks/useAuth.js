import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  loginUser,
  registerUser,
  logoutUser,
  checkAuthStatus,
  clearError,
  resetAuth
} from '../store/authSlice';

/**
 * Custom hook for authentication operations
 * Provides auth state and methods for login, register, logout
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, hasInitialized, isCheckingAuth } = useSelector((state) => state.auth);

  // Debug: Log auth state
  console.log('useAuth Debug - Auth state:', { user, isAuthenticated, loading, error, hasInitialized, isCheckingAuth });

  // Check authentication status on mount (only once)
  useEffect(() => {
    if (!hasInitialized && !isCheckingAuth) {
      // Only check auth status if we're not on login/signup pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
        console.log('Dispatching checkAuthStatus...');
        dispatch(checkAuthStatus());
      }
    }
  }, [dispatch, hasInitialized, isCheckingAuth]);

  const login = async (credentials) => {
    const result = await dispatch(loginUser(credentials));
    const success = result.type === 'auth/loginUser/fulfilled';

    if (success) {
      console.log('Login successful, checking auth status...');
      // Force a fresh auth check after successful login
      setTimeout(() => {
        dispatch(checkAuthStatus());
      }, 500);
    }

    return success;
  };

  const register = async (userData) => {
    const result = await dispatch(registerUser(userData));
    return result.type === 'auth/registerUser/fulfilled';
  };

  const logout = async () => {
    const result = await dispatch(logoutUser());
    return result.type === 'auth/logoutUser/fulfilled';
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const resetAuthState = () => {
    dispatch(resetAuth());
  };

  return {
    // State
    user,
    isAuthenticated,
    loading, // This is for user actions (login, register, logout)
    error,
    isCheckingAuth, // This is for initial auth status check

    // Actions
    login,
    register,
    logout,
    clearAuthError,
    resetAuthState,

    // Computed values
    isLoggedIn: isAuthenticated && !!user,
    userRole: user?.role || null,
    userId: user?.id || user?._id || null,
  };
};

export default useAuth;