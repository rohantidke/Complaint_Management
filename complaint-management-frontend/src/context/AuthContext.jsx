import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  clearAuth,
  getUser,
  isAuthenticated,
  saveAuth,
} from "../utils/auth";

import * as authApi from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getUser());
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({
      email: email.trim(),
      password,
    });

    console.log("LOGIN RESPONSE:", response);

    const token =
      response?.token ||
      response?.accessToken;

    if (!token) {
      throw new Error(
        "Login successful but authentication token was not received."
      );
    }

    const loggedUser = {
      id: response?.id ?? response?.user?.id ?? null,

      name:
        response?.name ||
        response?.user?.name ||
        "User",

      email:
        response?.email ||
        response?.user?.email ||
        email,

      role:
        response?.role ||
        response?.user?.role ||
        "USER",
    };

    saveAuth(token, loggedUser);

    setUser(loggedUser);

    return response;
  };

  const register = async (data) => {
    return authApi.register(data);
  };

  const logout = () => {
    clearAuth();
    setUser(null);

    window.location.href = "/login";
  };

  const value = {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};