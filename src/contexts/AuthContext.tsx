import React, { createContext, useContext, useState, useEffect } from 'react';

// 👉 Define the context type
interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// 👉 Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      setUserRole('admin');
    }
  }, []);

 const login = async (username: string, password: string): Promise<boolean> => {
  try {
    const res = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      localStorage.setItem('adminToken', 'sample-token-value'); // Or use data.token if your backend returns a real token
      setIsAuthenticated(true);
      setUserRole('admin');
      return true;
    } else {
      console.warn('Login failed:', data.message);
      return false;
    }

  } catch (err) {
    console.error('Login error:', err);
    return false;
  }
};


  const logout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUserRole('');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 👉 Export the custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


