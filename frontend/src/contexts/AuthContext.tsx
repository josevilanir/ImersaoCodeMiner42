import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuthContextData, UserRole } from '../@types';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('@MovieNight:token');
    const storedRoomCode = sessionStorage.getItem('@MovieNight:roomCode');
    const storedUserRole = sessionStorage.getItem('@MovieNight:userRole') as UserRole;

    if (storedToken && storedRoomCode && storedUserRole) {
      setToken(storedToken);
      setRoomCode(storedRoomCode);
      setUserRole(storedUserRole);
    }
  }, []);

  function login(newToken: string, newRoomCode: string, role: UserRole) {
    sessionStorage.setItem('@MovieNight:token', newToken);
    sessionStorage.setItem('@MovieNight:roomCode', newRoomCode);
    sessionStorage.setItem('@MovieNight:userRole', role);

    setToken(newToken);
    setRoomCode(newRoomCode);
    setUserRole(role);
  }

  function logout() {
    sessionStorage.removeItem('@MovieNight:token');
    sessionStorage.removeItem('@MovieNight:roomCode');
    sessionStorage.removeItem('@MovieNight:userRole');

    setToken(null);
    setRoomCode(null);
    setUserRole(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        roomCode,
        userRole,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}