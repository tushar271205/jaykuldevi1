import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe } from '../api/auth';
import * as authApi from '../api/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) { setIsLoading(false); return; }
    try {
      const res = await getMe();
      setUser(res.data.user);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    const { accessToken: at, refreshToken: rt, user: u } = res.data;
    localStorage.setItem('accessToken', at);
    localStorage.setItem('refreshToken', rt);
    setAccessToken(at);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    const { accessToken: at, refreshToken: rt, user: u } = res.data;
    localStorage.setItem('accessToken', at);
    localStorage.setItem('refreshToken', rt);
    setAccessToken(at);
    setUser(u);
    return u;
  };

  const logout = async () => {
    try { await authApi.logout(); } catch {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      accessToken,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateUser,
      refetchUser: fetchMe,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
