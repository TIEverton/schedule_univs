import React, { createContext, useCallback, useState, useContext } from "react";
import api from "../services/api";

interface User {
  id: string;
  registration: string;
  user_type_id: number;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredetials {
  registration: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredetials): Promise<void>;
  signOut(): void;
  updatedUser(user: User): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem("@UniVS:token");
    const user = localStorage.getItem("@UniVS:user");

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { 
        token, 
        user: JSON.parse(user), 
      };
    }
    return {} as AuthState;
  });

  const signIn = useCallback(async ({ registration, password }) => { 
    const response = await api.post("/auth", {
      registration,
      password,
    });
    const { user } = response.data;
    const token = response.data.token.token;

    localStorage.setItem("@UniVS:token", token);
    localStorage.setItem("@UniVS:user", JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("@UniVS:token");
    localStorage.removeItem("@UniVS:user");
    setData({} as AuthState);
  }, []);

  const updatedUser = useCallback(
    (user: User) => {
      localStorage.setItem('@UniVS:user', JSON.stringify(user));
      setData({ 
        token: data.token, 
        user, 
      });
    },
    [data.token],
  );

  return (
    <AuthContext.Provider value={
      { 
        user: data.user, 
        signIn, 
        signOut,
        updatedUser,
      }
    }>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export default AuthContext;
