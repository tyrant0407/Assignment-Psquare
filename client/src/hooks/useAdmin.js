import { useState, useCallback } from 'react';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getDashboardStats, 
  getSystemLogs 
} from '../api/admin.api';

/**
 * Custom hook for admin operations
 * Provides admin-specific functionality and state management
 */
export const useAdmin = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [systemLogs, setSystemLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getUsers(params);
      setUsers(data.users || data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getUserById(id);
      setCurrentUser(data.user || data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const editUser = useCallback(async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await updateUser(id, userData);
      const updatedUser = data.user || data;
      
      // Update users list
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ));
      
      // Update current user if it's the same
      if (currentUser?.id === id) {
        setCurrentUser(updatedUser);
      }
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const removeUser = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUser(id);
      
      // Remove from users list
      setUsers(prev => prev.filter(user => user.id !== id));
      
      // Clear current user if it's the same
      if (currentUser?.id === id) {
        setCurrentUser(null);
      }
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getDashboardStats();
      setDashboardStats(data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSystemLogs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getSystemLogs(params);
      setSystemLogs(data.logs || data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch system logs');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearCurrentUser = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return {
    // State
    users,
    currentUser,
    dashboardStats,
    systemLogs,
    loading,
    error,
    
    // Actions
    fetchUsers,
    fetchUserById,
    editUser,
    removeUser,
    fetchDashboardStats,
    fetchSystemLogs,
    clearError,
    clearCurrentUser,
    
    // Computed values
    hasUsers: users.length > 0,
    hasLogs: systemLogs.length > 0,
    isLoadingAdmin: loading,
  };
};

export default useAdmin;