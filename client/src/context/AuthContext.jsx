import { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";

const AuthContext = createContext(null);

/**
 * Minimal AuthContext - only provides auth state and methods
 * All logic is handled by Redux store and useAuth hook
 */
export const AuthProvider = ({ children }) => {
  const authData = useAuth();

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access auth context
 * @deprecated Use useAuth hook directly instead for better performance
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
