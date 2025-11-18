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

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('@MovieNight:token');
    const storedRoomCode = localStorage.getItem('@MovieNight:roomCode');
    const storedUserRole = localStorage.getItem('@MovieNight:userRole') as UserRole;

    if (storedToken && storedRoomCode && storedUserRole) {
      setToken(storedToken);
      setRoomCode(storedRoomCode);
      setUserRole(storedUserRole);
    }
  }, []);

  function login(newToken: string, newRoomCode: string, role: UserRole) {
    localStorage.setItem('@MovieNight:token', newToken);
    localStorage.setItem('@MovieNight:roomCode', newRoomCode);
    localStorage.setItem('@MovieNight:userRole', role);

    setToken(newToken);
    setRoomCode(newRoomCode);
    setUserRole(role);
  }

  function logout() {
    localStorage.removeItem('@MovieNight:token');
    localStorage.removeItem('@MovieNight:roomCode');
    localStorage.removeItem('@MovieNight:userRole');

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