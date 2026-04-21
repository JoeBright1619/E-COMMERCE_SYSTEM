import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserDto as User, AuthResponseDto } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (authData: AuthResponseDto) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    localStorage.removeItem('cagura_token');
    localStorage.removeItem('cagura_user');
    localStorage.removeItem('cagura_expires_at');
    setUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('cagura_user');
    const storedToken = localStorage.getItem('cagura_token');
    const storedExpiresAt = localStorage.getItem('cagura_expires_at');

    if (storedUser && storedToken && storedExpiresAt) {
      if (new Date(storedExpiresAt) > new Date()) {
        setUser(JSON.parse(storedUser));
      } else {
        // Token expired
        logout();
      }
    }
  }, []);

  const login = (authData: AuthResponseDto) => {
    localStorage.setItem('cagura_token', authData.token);
    localStorage.setItem('cagura_user', JSON.stringify(authData.user));
    localStorage.setItem('cagura_expires_at', authData.expiresAt);
    setUser(authData.user);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
