'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'owner' | 'sitter';
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface State {
  user: User | null;
  isLoading: boolean;
  token: string | null;
}

type Action =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | {
      type: 'INITIALIZE';
      payload: { user: User | null; token: string | null };
    }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_FAILURE' };

interface AuthContextType extends State {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (payload: RegisterPayload) => Promise<void>;
}

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        user: null,
        token: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
      };
    case 'INITIALIZE':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
      };

    default:
      return state;
  }
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialState: State = {
    user: null,
    isLoading: true,
    token: null,
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // 元件首次掛載時執行，用於處理頁面刷新後的持續登入。
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userString = localStorage.getItem('user');

        if (token && userString) {
          const user = JSON.parse(userString);
          dispatch({ type: 'INITIALIZE', payload: { user, token } });
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          dispatch({
            type: 'INITIALIZE',
            payload: { user: null, token: null },
          });
        }
      } catch (error) {
        console.error('初始化驗證失敗', error);
        dispatch({ type: 'INITIALIZE', payload: { user: null, token: null } });
      }
    };
    initializeAuth();
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await fetch(`${API_URL}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '登入時發生錯誤');
      }

      const { accessToken, user } = data;

      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token: accessToken },
      });
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (payload: RegisterPayload) => {
    dispatch({ type: 'REGISTER_START' });

    try {
      const dataToSend = {
        ...payload,
        role: 'owner',
      };

      const response = await fetch(`${API_URL}register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof data === 'string' ? data : data.message || '註冊時發生錯誤';
        throw new Error(errorMessage);
      }

      const { accessToken, user } = data;

      localStorage.setItem('authToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      // 註冊成功後，直接 dispatch LOGIN_SUCCESS，實現自動登入的 UX。
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token: accessToken },
      });
    } catch (error) {
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      dispatch({ type: 'REGISTER_FAILURE' });
      throw error;
    }
  };

  const value = useMemo(
    () => ({
      ...state,
      isAuthenticated: !!state.user,
      login,
      logout,
      register,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
