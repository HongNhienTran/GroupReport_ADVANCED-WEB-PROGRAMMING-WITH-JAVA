import { createContext, useContext, useState } from 'react';
import { authApi } from '../api/authApi';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('adminUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('adminAccessToken'));

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    const authData = res.data;
    if (authData?.user?.role !== 'ADMIN') {
      throw new Error('Tài khoản này không có quyền Quản trị viên (ADMIN).');
    }
    localStorage.setItem('adminAccessToken', authData.accessToken);
    localStorage.setItem('adminRefreshToken', authData.refreshToken);
    localStorage.setItem('adminUser', JSON.stringify(authData.user));
    setToken(authData.accessToken);
    setUser(authData.user);
    return authData;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('adminRefreshToken');
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Ignore network errors on logout
      }
    }
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    localStorage.removeItem('adminUser');
    setToken(null);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(token && user && user.role === 'ADMIN'),
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return ctx;
}
